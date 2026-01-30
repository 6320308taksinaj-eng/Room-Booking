const prisma = require("../prisma");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/"); // Store files in the 'images' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop(),
    );
  },
});

const upload = multer({ storage: storage });

// GET /rooms
exports.getRooms = async (req, res) => {
  try {
    //
    const rooms = await prisma.room.findMany({
      // id, name, building
      // select: { id:true, name:true, building:true, capacity:true },   //projection
      include: {
        bookings: { include: { user: true } },
      },
      //where: { id : { not: 2 } },
    });

    const roomsWithUrl = rooms.map(room => ({
      ...room,
      pictureUrl: room.picture ? `${req.protocol}://${req.get('host')}/images/${room.picture}` : null
    }))


    res.json({
      status: "success",
      message: "Rooms retrieved successfully",
      data: roomsWithUrl,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: { detail: "Unable to fetch rooms" },
    });
  }
};

// GET /rooms/:id
exports.getRoomById = async (req, res) => {
  const roomId = parseInt(req.params.id, 10);

  if (isNaN(roomId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid room id",
    });
  }

  try {
    const room = await prisma.room.findUnique({
      //select: { id: true, name: true, capacity: true }, //projection
      where: { id: roomId },
      include: {
        bookings: { include: { user: true } },
      },
      // select * from Room where id = ${roomId}
    });

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

   // ส่งรูปภาพกลับไปด้วยเป็น URL
    if (room.picture) {
      room.pictureUrl = `${req.protocol}://${req.get('host')}/images/${room.picture}`;
    }

    res.json({
      status: "success",
      message: "Room retrieved successfully",
      data: room,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: { detail: "Unable to fetch room" },
    });
  }
};

// POST /rooms
exports.createRoom = async (req, res) => {
  // Use upload.single middleware to handle file upload
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { name, building, capacity } = req.body;
    console.log(req.body);
    const picture = req.file ? req.file.filename : null; // Get filename if uploaded
    console.log(picture);
    try {
      const room = await prisma.room.create({
        data: {
          name,
          building: building || null,
          capacity: parseInt(capacity),
          picture, // Store filename in the database
        },
      });

      res.json({
        status: "success",
        message: "Room created successfully",
        data: room,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// exports.createRoom = async (req, res) => {
//   const { name, building, capacity } = req.body;

//   if (!name || typeof capacity !== 'number') {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Invalid request body',
//       error: {
//         detail: 'name is required and capacity must be a number',
//       },
//     });
//   }

//   try {
//     const newRoom = await prisma.room.create({
//       data: {
//         name,       //roomname: name
//         building: building || null,
//         capacity,
//       },
//     });

//     // created
//     res.status(201).json({
//       status: 'success',
//       message: 'Room created successfully',
//       data: newRoom,
//     });
//   } catch (error) {
//     console.error('Error creating room:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: { detail: 'Unable to create room' },
//     });
//   }
// };

// PUT /rooms/:id
exports.updateRoom = async (req, res) => {
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { id } = req.params;
    const { name, building, capacity, isActive } = req.body;
    const picture = req.file ? req.file.filename : null;

    try {
      const room = await prisma.room.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
          building: building || null,
          capacity: parseInt(capacity),
          isActive: typeof isActive === "boolean" ? isActive : true,
          picture, // Update filename if a new file is uploaded
        },
      });
      res.json({
        status: "success",
        message: "Room update successfully",
        data: room,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// exports.updateRoom = async (req, res) => {
//   const roomId = parseInt(req.params.id, 10);
//   const { name, building, capacity, isActive } = req.body;

//   if (isNaN(roomId)) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Invalid room id',
//     });
//   }

//   if (!name || typeof capacity !== 'number') {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Invalid request body',
//       error: {
//         detail: 'name is required and capacity must be a number',
//       },
//     });
//   }

//   try {
//     const updatedRoom = await prisma.room.update({
//       where: { id: roomId },
//       data: {
//         name,
//         building: building ?? null,
//         capacity,
//         isActive: typeof isActive === 'boolean' ? isActive : undefined,
//       },
//     });

//     res.json({
//       status: 'success',
//       message: 'Room updated successfully',
//       data: updatedRoom,
//     });
//   } catch (error) {
//     console.error('Error updating room:', error);

// Prisma error: record not found
// if (error.code === 'P2025') {
//   return res.status(404).json({
//     status: 'error',
//     message: 'Room not found',
//   });
// }

// res.status(500).json({
//   status: 'error',
//   message: 'Internal server error',
//   error: { detail: 'Unable to update room' },
// });
//   }
// };
// DELETE /rooms/:id
exports.deleteRoom = async (req, res) => {
  const roomId = parseInt(req.params.id, 10);

  if (isNaN(roomId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid room id",
    });
  }

  try {
    const deletedRoom = await prisma.room.delete({
      where: { id: roomId },
    });

    res.json({
      status: "success",
      message: "Room deleted successfully",
      data: deletedRoom,
    });
  } catch (error) {
    console.error("Error deleting room:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: { detail: "Unable to delete room" },
    });
  }
};

// /q/capacity/500
exports.getRoomsByCapacity = async (req, res) => {
  const min = parseInt(req.params.min, 0);
  const max = parseInt(req.params.max, 0);
  const rooms = await prisma.room.findMany({
    where: { capacity: { gte: min, lte: max } },
  });

  res.json({
    status: "success",
    message: "Rooms retrieved successfully",
    data: rooms,
  });
};

exports.getRoomsByCapacityRange = async (req, res) => {
  const min = parseInt(req.params.min, 0);
  const max = parseInt(req.params.max, 0);
  const rooms = await prisma.room.findMany({
    where: { capacity: { gte: min, lte: max } }, // between min and max
    orderBy: { capacity: "desc" },
  });

  res.json({
    status: "success",
    message: "Rooms retrieved successfully",
    data: rooms,
  });
};

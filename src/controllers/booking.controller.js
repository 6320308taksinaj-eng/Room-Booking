const prisma = require('../prisma');

// GET /bookings (รวม room + user)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { id: 'desc' },
      include: { room: true, user: true },
    });

    res.json({ status: 'success', message: 'Bookings retrieved successfully', data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// GET /bookings/:id (รวม room + user)
exports.getBookingById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid booking id' });

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true, user: true },
    });

    if (!booking) return res.status(404).json({ status: 'error', message: 'Booking not found' });

    res.json({ status: 'success', message: 'Booking retrieved successfully', data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// POST /bookings
exports.createBooking = async (req, res) => {
  const { roomId, userId, startAt, endAt, purpose, status } = req.body;

  if (!roomId || !userId || !startAt || !endAt || !purpose) {
    return res.status(400).json({
      status: 'error',
      message: 'roomId, userId, startAt, endAt, purpose are required',
    });
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        roomId: Number(roomId),
        userId: Number(userId),
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        purpose: String(purpose),
        status: status ? String(status) : undefined,
      },
      include: { room: true, user: true },
    });

    res.status(201).json({ status: 'success', message: 'Booking created successfully', data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// PUT /bookings/:id
exports.updateBooking = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid booking id' });

  const { startAt, endAt, purpose, status } = req.body;

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(startAt ? { startAt: new Date(startAt) } : {}),
        ...(endAt ? { endAt: new Date(endAt) } : {}),
        ...(purpose ? { purpose: String(purpose) } : {}),
        ...(status ? { status: String(status) } : {}),
      },
      include: { room: true, user: true },
    });

    res.json({ status: 'success', message: 'Booking updated successfully', data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// DELETE /bookings/:id
exports.deleteBooking = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid booking id' });

  try {
    const booking = await prisma.booking.delete({ where: { id } });
    res.json({ status: 'success', message: 'Booking deleted successfully', data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

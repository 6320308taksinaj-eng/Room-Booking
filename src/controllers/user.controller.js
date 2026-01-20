const prisma = require('../prisma');

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        booking: {include: {room: true}},
      },
    });
    res.json({
      
      status: 'success',
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve users',
    });
  }
}

// GET /users/:id
exports.getUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include:{
        booking: { include: {room: true}},
      },
    });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    res.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve user',
    });
  }
}

// POST /users
exports.createUser = async (req, res) => {
  const { name, email, password, tel, role } = req.body;
    try {
    const newUser = await prisma.user.create({
      data: { name, email, password, tel, role },
    });
    res.status(201).json({
      status: 'success',
        message: 'User created successfully',
        data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
        status: 'error',
        message: 'Failed to create user',
    });
  }
}

// PUT /users/:id
exports.updateUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { name, email, password, tel, role } = req.body;
    if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }
    try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, password, tel, role },
    });
    res.json({
      status: 'success',
        message: 'User updated successfully',
        data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
        status: 'error',
        message: 'Failed to update user',
    });
  }
}

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid user id',
    });
  }
    try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.json({
        status: 'success',
        message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
        status: 'error',
        message: 'Failed to delete user',
    });
  }
}
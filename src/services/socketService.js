const UserService = require("../Service/User/UserService");

module.exports.handleSocketEvents = async(socket) => {
  try {
      socket.on('updateUserRealtimeLocation', async(data, userId) => {
          const realTimeData = await UserService.updateUserRealTimeLocation(data, userId);
          socket.emit('updateUserRealtimeLocation', realTimeData);
      });

      socket.on('nearestDriver', async(data, userId) => {
          const drivers = await UserService.getNearByDriver(data, userId);
          socket.emit('nearestDriver', drivers);
      });
  } catch (error) {
    console.error('Error fetching real-time data:', error);
  }
}

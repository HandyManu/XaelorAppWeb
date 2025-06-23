const logoutController = {};

logoutController.logout = async (req, res) => {
    //Borrar la cookie de authToken

    res.clearCookie('authToken');
    res.clearCookie('userType');

    res.json({ message: 'Serrión Cesada' });

};

export default logoutController;


import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    mysql: {
        enable: true,
        package: 'egg-mysql',
    },
    io: {
        enable: false,
        package: 'egg-socket.io',
    },
    validate: {
        enable: true,
        package: 'egg-validate',
    },
    sequelize: {
        enable: true,
        package: 'egg-sequelize-ts',
    },
};

export default plugin;

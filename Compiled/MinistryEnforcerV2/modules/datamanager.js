"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = exports.XPManager = exports.GlobalUserManager = exports.LocalUserManager = exports.BaseUserManager = exports.ServerManager = exports.Server = exports.Setting = exports.LocalUser = exports.GlobalUser = exports.BaseUser = void 0;
let cacheData = require('../data/serverData.json');
let lastCache = JSON.parse(JSON.stringify(cacheData));
const fs = require("fs");
const defaultSettings = [{ name: 'gameChannel', value: false }, { name: 'gameBool', value: false }, { name: 'gameDelay', value: 3600000 }];
let change = false;
function markChange() {
    change = true;
}
class BaseUser {
    constructor(id, xp) {
        this.id = id;
        this.xp = xp ? xp : 0;
        this.epoch = 0;
    }
}
exports.BaseUser = BaseUser;
class GlobalUser extends BaseUser {
    constructor(id, xp) {
        console.log(id);
        super(id, xp ? xp : undefined);
        this.gems = 0;
        this.namecard = '/default';
    }
}
exports.GlobalUser = GlobalUser;
class LocalUser extends BaseUser {
    constructor(id, xp) {
        console.log(id);
        super(id, xp ? xp : undefined);
        this.balance = { wallet: 0, bank: 0 };
    }
}
exports.LocalUser = LocalUser;
class Setting {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
exports.Setting = Setting;
class Server {
    constructor(id) {
        this.users = [];
        this.id = id;
        this.settings = defaultSettings;
        cacheData.servers.push(this);
        markChange();
    }
}
exports.Server = Server;
class ServerManager {
    constructor(server) {
        this.id = server.id;
        this.settings = server.settings;
        this.getXPManager = function () {
            return new XPManager(server);
        };
        this.getUser = function (UUID) {
            let user = server.users.find(user => user.id == UUID);
            if (user) {
                return new LocalUserManager(server, user);
            }
            server.users.push(new LocalUser(UUID));
            return new LocalUserManager(server, server.users.find(user => user.id == UUID));
        };
        this.getSetting = function (name) {
            let setting = server.settings.find(setting => setting.name == name);
            if (setting) {
                return setting;
            }
            return new Setting('fail', false);
        };
        this.setSetting = function (name, value) {
            let setting = server.settings.find(setting => setting.name == name);
            if (setting) {
                setting.value = value;
            }
            else {
                setting = new Setting(name, value);
                server.settings.push(setting);
            }
            markChange();
        };
    }
}
exports.ServerManager = ServerManager;
class BaseUserManager {
    constructor(user) {
        // Properties
        function level(xp) {
            let level = 0;
            do {
                level++;
            } while (xp >= (5 * (level ** 2) + (50 * level) + 100));
            return level;
        }
        this.xp = user.xp;
        this.level = level(this.xp);
        this.id = user.id;
        this.epoch = user.epoch;
        // Methods
        this.setXP = function (xp) {
            user.xp = xp;
            markChange();
        };
        this.addXP = function (xp) {
            user.xp = user.xp + xp;
            markChange();
        };
        this.setEpoch = function () {
            user.epoch = Date.now();
            markChange();
        };
    }
}
exports.BaseUserManager = BaseUserManager;
class LocalUserManager extends BaseUserManager {
    constructor(server, user) {
        super(user);
        // Properties
        this.wallet = user.balance.wallet;
        this.bank = user.balance.bank;
        this.server = server;
        // Methods
        this.addWallet = function (currency) {
            user.balance.wallet = user.balance.wallet + currency;
            markChange();
        };
        this.addBank = function (currency) {
            user.balance.bank = user.balance.bank + currency;
            markChange();
        };
        this.getGlobalUser = function () {
            let gUser = cacheData.users.find(gUser => gUser.id == user.id);
            if (gUser) {
                return new GlobalUserManager(gUser);
            }
            gUser = new GlobalUser(user.id);
            let index = cacheData.users.push(gUser);
            return new GlobalUserManager(cacheData.users[index - 1]);
        };
    }
}
exports.LocalUserManager = LocalUserManager;
class GlobalUserManager extends BaseUserManager {
    constructor(user) {
        super(user);
        this.rank = cacheData.users.sort((a, b) => b.xp - a.xp).indexOf(user) + 1;
        this.gems = user.gems;
        this.namecard = user.namecard;
        this.addGems = function (gems) {
            user.gems = user.gems + gems;
            markChange();
        };
        this.setGems = function (gems) {
            user.gems = gems;
            markChange();
        };
        this.setNamecard = function () { }; // Future Update
    }
}
exports.GlobalUserManager = GlobalUserManager;
class XPManager extends ServerManager {
    constructor(server) {
        super(server);
        // Read Values
    }
}
exports.XPManager = XPManager;
exports._ = {
    getData() {
        return cacheData;
    },
    writeCache() {
        fs.writeFileSync('/workspaces/LevelingBot/MinistryEnforcerV2/data/serverData.json', JSON.stringify(cacheData));
    },
    getManager(id) {
        let server = cacheData.servers.find(server => server.id == id);
        if (server) {
            return new ServerManager(server);
        }
        server = new Server(id);
        return new ServerManager(server);
    },
    getGlobalUsers() {
        return cacheData.users;
    },
    getLevel(xp) {
        let level = 0;
        do {
            level++;
        } while (xp >= exports._.levelRequirement(level));
        return level;
    },
    levelRequirement(lvl) {
        return (5 * (lvl ** 2) + (50 * lvl) + 100);
    },
    getGlobalRank(xp) {
        let data = cacheData;
        let users = data.users;
        let fakeUser = new GlobalUser('fake', xp);
        users = users.slice(0, users.length - 1);
        users.push(fakeUser);
        users.sort((a, b) => b.xp - a.xp);
        return users.indexOf(fakeUser) + 1;
    },
};
exports.default = exports._;
function startCache() {
    console.log('Cache Check');
    if (JSON.stringify(cacheData) != JSON.stringify(lastCache)) {
        console.log('Writing to file');
        lastCache = JSON.parse(JSON.stringify(cacheData));
        fs.writeFileSync('../data/serverData.json', JSON.stringify(cacheData));
    }
    setTimeout(() => { startCache(); }, 300000);
}
startCache();

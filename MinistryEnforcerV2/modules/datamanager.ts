let cacheData: ServerData = require('../data/serverData.json')
let lastCache = JSON.parse(JSON.stringify(cacheData))
import fs = require('fs')
import hash from 'object-hash'
const defaultSettings = [{name:'gameChannel',value:false},{name:'gameBool',value:false},{name:'gameDelay',value:3600000}]
let change = false
function markChange() {
    change = true
}
export class BaseUser {
    id: string
    xp: number
    epoch: number
    constructor(id: string, xp?: number) {
        this.id = id
        this.xp = xp ? xp : 0
        this.epoch = 0
    }
}
export class GlobalUser extends BaseUser {
    gems: number
    namecard: string
    constructor(id: string, xp?: number) {
        console.log(id)
        super(id, xp ? xp : undefined)
        this.gems = 0
        this.namecard = '/default'
    }
}
export class LocalUser extends BaseUser {
    balance: { wallet: number, bank: number }
    constructor(id: string, xp?: number) {
        console.log(id)
        super(id, xp ? xp : undefined)
        this.balance = { wallet: 0, bank: 0 }
    }
}
export class Setting {
    name: string
    value: any
    constructor(name:string,value:any) {
        this.name = name
        this.value = value
    }
}
export class Server {
    id: string
    users: LocalUser[]
    settings: Setting[]
    constructor(id: string) {
        this.users = []
        this.id = id
        this.settings = defaultSettings
        cacheData.servers.push(this)
        markChange()
    }
}
export class ServerManager {
    readonly id: string
    readonly settings: Setting[]
    getXPManager: () => XPManager
    getUser: (UUID: string) => LocalUserManager
    getSetting: (name: string) => Setting
    setSetting: (name: string,value: any) => void
    constructor(server: Server) {
        this.id = server.id
        this.settings = server.settings
        this.getXPManager = function () {
            return new XPManager(server)
        }
        this.getUser = function (UUID: string) {
            let user = server.users.find(user => user.id == UUID)
            if (user) {
                return new LocalUserManager(server, user)
            }
            server.users.push(new LocalUser(UUID))
            return new LocalUserManager(server, server.users.find(user => user.id == UUID) as LocalUser)
        }
        this.getSetting = function(name: string) {
            let setting = server.settings.find(setting => setting.name==name) 
            if (setting) {
                return setting
            }
            return new Setting('fail',false)
        }
        this.setSetting = function(name:string,value:any) {
            let setting = server.settings.find(setting => setting.name==name) 
            if (setting) {
                setting.value = value
            } else {
                setting = new Setting(name,value)
                server.settings.push(setting)
            }
            markChange()
        }
    }
}
export class BaseUserManager {
    // Properties
    readonly xp: number
    readonly level: number
    readonly id: string
    readonly epoch: number
    // Methods
    setEpoch: () => void
    setXP: (xp: number) => void
    addXP: (xp: number) => void
    constructor(user: BaseUser) {
        // Properties
        function level(xp: number) {
            let level = 0
            do {
                level++
            } while (xp >= (5 * (level ** 2) + (50 * level) + 100))
            return level
        }
        this.xp = user.xp
        this.level = level(this.xp)
        this.id = user.id
        this.epoch = user.epoch
        // Methods
        this.setXP = function (xp: number) {
            user.xp = xp
            markChange()
        }
        this.addXP = function (xp: number) {
            user.xp = user.xp + xp
            markChange()
        }
        this.setEpoch = function () {
            user.epoch = Date.now()
            markChange()
        }
    }
}
export class LocalUserManager extends BaseUserManager {
    // Properties
    wallet: number
    bank: number
    server: Server
    // Methods
    addBank: (currency: number) => void
    addWallet: (currency: number) => void
    getGlobalUser: () => GlobalUserManager
    constructor(server: Server, user: LocalUser) {
        super(user)
        // Properties
        this.wallet = user.balance.wallet
        this.bank = user.balance.bank
        this.server = server
        // Methods
        this.addWallet = function (currency: number) {
            user.balance.wallet = user.balance.wallet + currency
            markChange()
        }
        this.addBank = function (currency: number) {
            user.balance.bank = user.balance.bank + currency
            markChange()
        }
        this.getGlobalUser = function () {
            let gUser = cacheData.users.find(gUser => gUser.id == user.id)
            if (gUser) {
                return new GlobalUserManager(gUser)
            }
            gUser = new GlobalUser(user.id)
            let index = cacheData.users.push(gUser)
            return new GlobalUserManager(cacheData.users[index-1])
        }
    }
}
export class GlobalUserManager extends BaseUserManager {
    readonly gems: number
    readonly namecard: string
    setGems: (gems:number) => void
    addGems: (gems:number) => void
    setNamecard: (namecard: string) => void
    constructor(user:GlobalUser) {
        super(user)
        this.gems = user.gems
        this.namecard = user.namecard
        this.addGems = function (gems:number) {
            user.gems = user.gems + gems
            markChange()
        }
        this.setGems = function (gems:number) {
            user.gems = gems
            markChange()
        }
        this.setNamecard = function () {} // Future Update
    }
}
export class XPManager extends ServerManager {
    constructor(server: Server) {
        super(server)
        // Read Values
    }
}
export interface ServerData {
    users: GlobalUser[]
    servers: Server[]
}
export const _ = {
    getData() {
        return cacheData
    },
    writeCache() {
        fs.writeFileSync('/workspaces/LevelingBot/MinistryEnforcerV2/data/serverData.json', JSON.stringify(cacheData))
    },
    getManager(id: string) {
        let server = cacheData.servers.find(server => server.id == id)
        if (server) {
            return new ServerManager(server)
        }
        server = new Server(id)
        
        return new ServerManager(server)
    },
    getGlobalUsers() {
        return cacheData.users
    },
    getLevel(xp: number) {
        let level = 0
        do {
            level++
        } while (xp >= _.levelRequirement(level))
        return level
    },
    levelRequirement(lvl: number): number {
        return (5 * (lvl ** 2) + (50 * lvl) + 100)
    },
    getGlobalRank(xp: number) {
        let data = cacheData
        let users = data.users
        let fakeUser = new GlobalUser('fake',xp)
        users = users.slice(0,users.length-1)
        users.push(fakeUser)
        users.sort((a, b) => b.xp - a.xp)
        return users.indexOf(fakeUser) + 1
    },
}
export default _
function startCache() {
    console.log('Cache Check')
    if (JSON.stringify(cacheData)!=JSON.stringify(lastCache)) {
        console.log('Writing to file')
        lastCache = JSON.parse(JSON.stringify(cacheData))
        fs.writeFileSync('./data/serverData.json',JSON.stringify(cacheData))
    }
    setTimeout(()=>{startCache()}, 300000);
}
startCache()
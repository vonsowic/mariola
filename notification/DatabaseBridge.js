const pg = require('pg');
const channels = require('./channels');


class DatabaseBridge {
    constructor(databaseUrl=process.env.DATABASE_URL) {
        this._client = new pg.Client(databaseUrl);
        this._connect();
        this._initializeTriggers();
        this._listeners = new Map();
    }

    async _connect() {
        await this._client.connect();
        this._listen();
        this._client.on('notification', message => {
            this._listeners
                .get(message.channel)(JSON.parse(message.payload))
        })
    }

    setListenerOn(channel, fun = record => {console.log(record)}){
        this._listeners.set(channel, fun);
        return this
    }

    end() {
        this._unlisten();
        this._client.end()
    }

    async _initializeTriggers() {
        await this._createTrigger(channels.INTENTION_CREATED, 'exchange_intentions', 'after insert');
        await this._createTrigger(channels.INTENTION_REMOVED, 'exchange_intentions', 'after delete');
        await this._createTrigger(channels.EXCHANGE_CREATED, 'exchanges', 'after insert');
    }

    _createTrigger(channel, tableName, eventType){
        return this._client.query(`
            CREATE OR REPLACE FUNCTION notification${channel}() RETURNS TRIGGER AS $$
                DECLARE
                    fid INTEGER;
                BEGIN
                    SELECT "facultyId" 
                    INTO fid
                    FROM courses
                    WHERE id=NEW."whatId"
                    LIMIT 1;
                    
                    PERFORM pg_notify(
                        '${channel}', 
                        (row_to_json(NEW)::jsonb || jsonb ('{"facultyId": ' || fid || '}'))::text
                    );
                    
                    RETURN null;
                END;
            $$ LANGUAGE plpgsql;
        
            DROP TRIGGER IF EXISTS notify${channel} ON ${tableName};
            CREATE TRIGGER notify${channel}
            ${eventType}
            ON ${tableName}
            FOR EACH ROW EXECUTE PROCEDURE notification${channel}();
        `)
    }


    _listen(){
        this._forEachChannel('LISTEN')
    }

    _unlisten(){
        this._forEachChannel('UNLISTEN')
    }

    _forEachChannel(command){
        Object.values(channels)
            .forEach(async ch => await this._client.query(`${command} ${ch};`))
    }
}

module.exports=DatabaseBridge;
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({port:8080});

const PlayersData = {};

wss.on('connection', function connection(ws)
{
    ws.on('message', function message(data)
    {
        const ParsedData = JSON.parse(data);
        if(ParsedData.type == 'playerdata')
        {
            const {PlayerID, position, velocity, rotation, health} = ParsedData.data;
            PlayersData[PlayerID] = {ws, position, velocity, rotation, health};
            BroadcastInformation(ws, PlayerID);
        }
    });
});


function BroadcastInformation(CurrentClient, CurrentPlayerID){
    const CurrentPlayerData = { PlayerID: CurrentPlayerID, ...PlayersData[CurrentPlayerID]};
    const nearbyPlayerIDs = [];
    for(const [PlayerID, playerdata] of Object.entries(PlayersData))
    {
        const distance = CalculateDistance(playerdata.position, PlayersData[CurrentPlayerID].position);
       
        if(distance<=1000 && CurrentPlayerID!=PlayerID)
        { 
            console.log(`Distance between ${CurrentPlayerID} and ${PlayerID}: ${distance}`);
            nearbyPlayerIDs.push(PlayerID);
            const { ws, ...DataToSend} = CurrentPlayerData; //Omit the ws field
            playerdata.ws.send(JSON.stringify({
                type: 'playerUpdate',
                data: DataToSend
            }));
        }
    }

    CurrentClient.send(JSON.stringify({
        type: 'nearbyPlayers',
        data: nearbyPlayerIDs
    }))
}

function CalculateDistance(position1, position2)
{
    const x = position1.x - position2.x;
    const y = position1.y - position2.y;
    const z = position1.z - position2.z;
    return Math.sqrt(x*x + y*y + z*z);
}
import * as io from "socket.io-client";
import * as $ from "jquery";
import * as toastr from "toastr";

class WebsocketService {

    private socket;
    constructor() {
        let connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"]
        };
        this.socket = io("http://localhost:8000", connectionOptions);

        this.socket.on("connect", function(){
            $("#wsStatus").removeClass("text-red").addClass("text-green").text("Verbunden");
            toastr.info("Verbindug zum Websocket hergestellt!");
        });

        this.socket.on("disconnect", function(){
            $("#wsStatus").removeClass("text-green").addClass("text-red").text("Getrennt");
            toastr.error("Verbindug zum Websocket getrennt!");
        });

        this.socket.on("echo", (data) => console.log(data));

    }

    getVolume(setVolumeFunc): any {
        this.socket.on("getVolume", function(data) {
            setVolumeFunc(data.rangeID, data.volume);
        });
    }

    setVolume(rangeID, volume): any {
        this.socket.emit("setVolume", { "rangeID": rangeID, "volume": volume });
    }

    connect(): any {
        this.socket.connect();
    }

    disconnect(): any {
        this.socket.disconnect();
    }

}

export default WebsocketService;
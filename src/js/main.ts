import * as $ from "jquery";
import WebsocketService from "./websocket";

let connected = false;

$(() => {
    let ws = new WebsocketService();

    function setRangeVol(rangeID, volume) {
        const range = $(".input-range[data-rangeid='" + rangeID + "']");
        console.log("set vol!", volume);
        range.val(volume);
    }

    ws.getVolume(setRangeVol);

    function setVolume(range, rangeVol, mutebtn) {
        ws.setVolume(range.data("rangeid"), range.val());
        if (range.val() > 0) {
            rangeVol.removeClass(["text-red", "font-bold"]);
            mutebtn.removeClass("fa-volume-off").addClass("fa-volume-up");
            rangeVol.text(range.val().toString() + "%");
        } else {
            rangeVol.addClass(["text-red", "font-bold"]);
            mutebtn.removeClass("fa-volume-up").addClass("fa-volume-off");
            rangeVol.text("STUMM");
        }
    }

    $(".input-range").each(function() {
        const range = $(this); // Range Input element
        const rangeVol = $("#range-vol[data-rangeid='" + range.data("rangeid") + "']");
        const mutebtn = $(".mutebtn[data-rangeid='" + range.data("rangeid") + "']");

        setVolume(range, rangeVol, mutebtn);

        range.on("input", function()  {
            setVolume(range, rangeVol, mutebtn);
        });

        mutebtn.click(function() {
            if (range.val() > 0) {
                // Kanal ist nicht stumm!
                range.val(0);
                setVolume(range, rangeVol, mutebtn);
            } else {
                // Kanal ist stumm!
                range.val(100);
                setVolume(range, rangeVol, mutebtn);
            }
        });
    });


    $("#darkmode").click(function() {
        let body = $("body");
        let statuspanel = $("#statuspanel");
        let navbar = $("nav");
        if ($(this).is(":checked")) {
            // Enable darkmode
            body.removeClass("bg-grey-lightest").addClass("bg-black"); // Background Black
            body.removeClass("text-black").addClass("text-white"); // Text Color White
            statuspanel.removeClass("bg-grey-lighter").addClass("bg-grey-darkest"); // Background Black
            navbar.removeClass("bg-black").addClass("bg-grey-darkest"); // One color brighter
        } else {
            // Disable darkmode
            body.removeClass("bg-black").addClass("bg-grey-lightest"); // Background White
            body.removeClass("text-white").addClass("text-black"); // Text Color Black
            statuspanel.removeClass("bg-grey-darkest").addClass("bg-grey-lighter"); // Background Black
            navbar.removeClass("bg-grey-darkest").addClass("bg-black"); // Back to black
        }
    });

    $("#btnConnect").click(function() {
        ws.connect();
    });

    $("#btnDisconnect").click(function() {
        ws.disconnect();
    });
});
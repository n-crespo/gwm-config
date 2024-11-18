import React, { useState, useEffect } from "https://esm.sh/react@18?dev";
import { createRoot } from "https://esm.sh/react-dom@18/client?dev";
import * as zebar from "https://esm.sh/zebar@2";

const providers = zebar.createProviderGroup({
  network: { type: "network" },
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu" },
  date: { type: "date", formatting: "EEE MMM d, t" },
  battery: { type: "battery" },
  memory: { type: "memory" },
  weather: {
    type: "weather",
    latitude: 34.07005584776311,
    longitude: -118.45003755474067,
  },
  media: { type: "media" },
});

createRoot(document.getElementById("root")).render(<App />);

function App() {
  const [output, setOutput] = useState(providers.outputMap);

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  // ensures title + artist doesnt exceed 69 chars
  function stripMedia(title, artist) {
    const ellipsis = "…";
    const separator = " - ";

    const titleMax = Math.floor(50 - separator.length - 1);
    var artistMax = Math.ceil(19 - separator.length - 1);

    if (title.length < titleMax) {
      artistMax += titleMax - title.length;
    }

    // truncate, remove ending whitespace and add ellipsis if needed
    const truncate = (str, len) =>
      str.length > len
        ? str.slice(0, len - ellipsis.length).trim() + ellipsis
        : str;

    return `${truncate(title, titleMax)}${separator}${truncate(artist, artistMax)}`;
  }

  // Get icon to show for current network status.
  function getNetworkIcon(networkOutput) {
    switch (networkOutput.defaultInterface?.type) {
      case "ethernet":
        return <i className="nf nf-md-ethernet_cable"></i>;
      case "wifi":
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          return <i className="nf nf-md-wifi_strength_4"></i>;
        } else if (networkOutput.defaultGateway?.signalStrength >= 65) {
          return <i className="nf nf-md-wifi_strength_3"></i>;
        } else if (networkOutput.defaultGateway?.signalStrength >= 40) {
          return <i className="nf nf-md-wifi_strength_2"></i>;
        } else if (networkOutput.defaultGateway?.signalStrength >= 25) {
          return <i className="nf nf-md-wifi_strength_1"></i>;
        } else {
          return <i className="nf nf-md-wifi_strength_outline"></i>;
        }
      default:
        return <i className="nf nf-md-wifi_strength_off_outline"></i>;
    }
  }

  // Get icon to show for how much of the battery is charged.
  function getBatteryIcon(batteryOutput) {
    if (batteryOutput.chargePercent > 90)
      return <i className="nf nf-md-battery"></i>;
    if (batteryOutput.chargePercent > 70)
      return <i className="nf nf-md-battery_70"></i>;
    if (batteryOutput.chargePercent > 40)
      return <i className="nf nf-md-battery_40"></i>;
    if (batteryOutput.chargePercent > 20)
      return <i className="nf nf-md-battery_20"></i>;
    return <i className="nf nf-md-battery_0"></i>;
  }

  // Get icon to show for current weather status.
  function getWeatherIcon(weatherOutput) {
    switch (weatherOutput.status) {
      case "clear_day":
        return " ";
      case "clear_night":
        return " ";
      case "cloudy_day":
        return "  ";
      case "cloudy_night":
        return " ";
      case "light_rain_day":
        return " ";
      case "light_rain_night":
        return " ";
      case "heavy_rain_day":
        return " ";
      case "heavy_rain_night":
        return "";
      case "snow_day":
        return " ";
      case "snow_night":
        return " ";
      case "thunder_day":
        return " ";
      case "thunder_night":
        return " ";
    }
  }

  return (
    <div className="app">
      <div className="left">
        {output.glazewm && (
          <div className="workspaces">
            {output.glazewm.currentWorkspaces.map((workspace) => (
              <button
                className={`workspace ${workspace.hasFocus && "focused"} ${workspace.isDisplayed && "displayed"}`}
                onClick={() =>
                  output.glazewm.runCommand(
                    `focus --workspace ${workspace.name}`,
                  )
                }
                key={workspace.name}
              >
                {workspace.displayName ?? workspace.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="center">
        <div className="chip">
          {/* Checking if position and startTime are both 0 */}
          {(() => {
            // const { media } = output;
            const session = output.media?.session;

            if (session == null) {
              return " ";
            } else {
              return (
                <>
                  {session?.isPlaying ? "󰝚 " : "󰐊 "}
                  {stripMedia(session?.title, session?.artist)}
                  {/* {session?.title} {" - "} {session?.artist} */}
                </>
              );
            }
          })()}
        </div>
      </div>
      {/* {output.media.session?.title} -{" "} */}
      {/* {output.media.session?.artist} */}

      <div className="right">
        {output.glazewm && (
          <>
            {output.glazewm.bindingModes.map((bindingMode) => (
              <button className="binding-mode" key={bindingMode.name}>
                {bindingMode.displayName ?? bindingMode.name}
              </button>
            ))}

            <button
              className={`tiling-direction nf ${output.glazewm.tilingDirection === "horizontal" ? "nf-cod-split_horizontal" : "nf-cod-split_vertical"}`}
              onClick={() =>
                output.glazewm.runCommand("toggle-tiling-direction")
              }
            ></button>
          </>
        )}

        {output.network && (
          <div className="network">
            {getNetworkIcon(output.network)}
            {/* this displays the network name */}
            {/* {output.network.defaultGateway?.ssid} */}
          </div>
        )}

        {output.weather && (
          <div className="weather">
            {getWeatherIcon(output.weather)}
            {"  "}
            {Math.round(output.weather.fahrenheitTemp)}°F
          </div>
        )}

        {/* {output.memory && ( */}
        {/*   <div className="memory"> */}
        {/*     󰍛 */}
        {/*     {" " + Math.round(output.memory.usage)}% */}
        {/*   </div> */}
        {/* )} */}

        {/* {output.cpu && ( */}
        {/*   <div className="cpu"> */}
        {/*     <i className="nf nf-oct-cpu"></i> */}
        {/**/}
        {/* Change the text color if the CPU usage is high. */}
        {/*     <span className={output.cpu.usage > 85 ? "high-usage" : ""}> */}
        {/*       {Math.round(output.cpu.usage)}% */}
        {/*     </span> */}
        {/*   </div> */}
        {/* )} */}

        {output.battery && (
          <div className={`battery ${output.battery.isCharging && "charging"}`}>
            {/* Show icon for whether battery is charging. */}
            {output.battery.isCharging && "󱐋"}
            {getBatteryIcon(output.battery)}
            {" " + Math.round(output.battery.chargePercent)}%
          </div>
        )}

        <div className="date">{output.date?.formatted}</div>
      </div>
    </div>
  );
}

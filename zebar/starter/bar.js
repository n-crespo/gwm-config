import React, { useState, useEffect } from "https://esm.sh/react@18?dev";
import { createRoot } from "https://esm.sh/react-dom@18/client?dev";
import * as zebar from "https://esm.sh/zebar@2";

const providers = zebar.createProviderGroup({
  network: { type: "network", refreshInterval: 3000 },
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu" },
  date: { type: "date", formatting: "EEE MMM d, t" },
  battery: { type: "battery", refreshInterval: 1000 },
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
    let iconClass;
    let iconColor;
    switch (networkOutput.defaultInterface?.type) {
      case "ethernet":
        iconClass = "nf nf-md-ethernet_cable";
        iconColor = "red";
      case "wifi":
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          iconClass = "nf nf-md-wifi_strength_4";
        } else if (networkOutput.defaultGateway?.signalStrength >= 65) {
          iconClass = "nf nf-md-wifi_strength_3";
        } else if (networkOutput.defaultGateway?.signalStrength >= 40) {
          iconClass = "nf nf-md-wifi_strength_2";
        } else if (networkOutput.defaultGateway?.signalStrength >= 25) {
          iconClass = "nf nf-md-wifi_strength_1";
        } else {
          iconClass = "nf nf-md-wifi_strength_outline";
          iconColor = "red";
        }
        break;
      default:
        iconClass = "nf nf-md-wifi_strength_off_outline";
        iconColor = "red";
    }
    return (
      <i
        className={iconClass}
        style={{ color: iconColor, fontSize: "13px" }}
      ></i>
    );
  }

  // Get icon to show for how much of the battery is charged.
  // Get icon to show for how much of the battery is charged.
  function getBatteryIcon(batteryOutput) {
    let iconClass = "nf nf-md-battery_0";
    let iconColor = "red"; // Default color (red for low battery)

    if (batteryOutput.chargePercent == 100) {
      iconClass = "nf nf-md-battery";
      iconColor = "green";
    } else if (batteryOutput.chargePercent > 90) {
      iconClass = "nf nf-md-battery_90";
      iconColor = "green";
    } else if (batteryOutput.chargePercent > 80) {
      // 80s
      iconClass = "nf nf-md-battery_80";
      iconColor = "green";
    } else if (batteryOutput.chargePercent > 70) {
      // 70s
      iconClass = "nf nf-md-battery_70";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 60) {
      // 60s
      iconClass = "nf nf-md-battery_60";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 50) {
      // 50s
      iconClass = "nf nf-md-battery_50";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 40) {
      // 40s
      iconClass = "nf nf-md-battery_40";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 30) {
      // 30s
      iconClass = "nf nf-md-battery_30";
      iconColor = "yellowgreen";
    } else if (batteryOutput.chargePercent > 20) {
      // 20s
      iconClass = "nf nf-md-battery_20";
      iconColor = "#FFCE08";
      // teens
    } else if (batteryOutput.chargePercent > 10) {
      iconClass = "nf nf-md-battery_10";
      iconColor = "red";
    } else {
      // single digits
      iconClass = "nf nf-md-battery_0";
      iconColor = "red";
    }

    return (
      <i
        className={iconClass}
        style={{
          color: iconColor,
          fontSize: "12px",
          verticalAlign: "+1px",
        }}
      ></i>
    );
  }

  // Get icon to show for current weather status.
  function getWeatherIcon(weatherOutput) {
    var Icon = "test";
    var IconColor = "purple";
    switch (weatherOutput.status) {
      case "clear_day": {
        Icon = " ";
        IconColor = "#fad12f";
        break;
      }
      case "clear_night": {
        Icon = "";
        IconColor = "#f9f9f9";
        break;
      }
      case "cloudy_day": {
        Icon = "  ";
        IconColor = "#9c9c9c";
        break;
      }
      case "cloudy_night": {
        Icon = " ";
        IconColor = "#9c9c9c";
        break;
      }
      case "light_rain_day": {
        Icon = " ";
        IconColor = "#a8acdd";
        break;
      }
      case "light_rain_night": {
        Icon = " ";
        IconColor = "#a8acdd";
        break;
      }
      case "heavy_rain_day": {
        Icon = " ";
        IconColor = "#a8acdd";
        break;
      }
      case "heavy_rain_night": {
        Icon = " ";
        IconColor = "#7d85e0";
        break;
      }
      case "snow_day": {
        Icon = " ";
        IconColor = "#f9f9f9";
        break;
      }
      case "snow_night": {
        Icon = " ";
        IconColor = "#f9f9f9";
        break;
      }
      case "thunder_day": {
        Icon = " ";
        IconColor = "#a8acdd";
        break;
      }
      case "thunder_night": {
        Icon = " ";
        IconColor = "#7d85e0";
        break;
      }
      default: {
        Icon = weatherOutput.status;
        IconColor = "#f9f9f9";
      }
    }
    return <i style={{ color: IconColor, fontSize: "12px" }}>{Icon}</i>;
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
            {/* let IconClass, IconColor = getWeatherIcon(output.weather); */}
            {/* <i className={IconClass} style={{ color: IconColor }}></i> */}
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
            {/* Show icon for whether battery is charging. */}{" "}
            {output.battery.isCharging && (
              <i
                style={{
                  color: "#fad12f",
                  fontSize: "16px",
                  verticalAlign: "-1px",
                }}
              >
                󱐋
              </i>
            )}
            {!output.battery.isCharging && getBatteryIcon(output.battery)}
            {" " + Math.round(output.battery.chargePercent)}%
          </div>
        )}

        <div className="date">{output.date?.formatted}</div>
      </div>
    </div>
  );
}

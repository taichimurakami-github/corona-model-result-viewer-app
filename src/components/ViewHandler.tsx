import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../types/store";

import config from "../config.json";
import { ShowLineCharts } from "./generators/ShowLineCharts";
import { ShowSnapShotCharts } from "./generators/ShowSnapShotCharts";
import { useMemo } from "react";

export const ViewHandler = () => {
  const result = useSelector((arg: { state: StoreState }) => arg.state.result);
  const viewState = useSelector((arg: { state: StoreState }) => arg.state.view);

  //resultにデータが格納されていなかったら終了

  const displayChartTypes = config.View.Chart.chartTypes;
  const viewData = useMemo(() => {
    console.log("useMemo");
    if (result) {
      return {
        [displayChartTypes["001"]]: (
          <ShowLineCharts
            result={result}
            range={{
              start: null,
              end: null,
            }}
          />
        ),
        [displayChartTypes["002"]]: (
          <ShowLineCharts
            result={result}
            range={{
              start: 0,
              end: 3,
            }}
          />
        ),
        [displayChartTypes["003"]]: (
          <ShowLineCharts
            result={result}
            range={{
              start: 3,
              end: null,
            }}
          />
        ),
        [displayChartTypes["010"]]: <ShowSnapShotCharts result={result} />,
      };
    }
  }, [result]);

  if (result && viewData) {
    return (
      <>
        {viewState === ""
          ? viewData[displayChartTypes["010"]]
          : viewData[viewState]}
      </>
    );
  } else {
    return <>{<p>no data.</p>}</>;
  }
};

import config from "../../config.json";
import { LineChartDataset } from "../../types/chartJS";
import { resultData } from "../../types/data";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ShowLineCharts = (props: {
  result: resultData;
  range: {
    [id: string]: number | null;
  };
}) => {
  const result: resultData = props.result;
  const r_start: number = props.range?.start || 0;
  const r_end: number = props.range?.end || result.axisNames.length;

  //x軸のラベル：普通に数値を入れるだけ
  const x_axis_label = result.data[0].map((val, index) => index);

  //その他設定読みこみ
  const colors = config.View.Chart.colors;
  const width = config.View.Chart.width;

  const results = useMemo(() => {
    /**
     * chartJSのdatasetを作成する
     * @param spaceID
     * どの空間のデータセットを作成するかを空間IDで指定
     *
     * @param targetRange
     * axisNames内に指定されたデータの種類から、どれを取り出すかを規定
     */
    const createDataSets = (
      spaceID: number = 0,
      r_start: number = 0,
      r_end: number = result.axisNames.length
    ) => {
      const data = result.data[spaceID];
      const datasetsFromResult = [];

      for (let i = r_start; i < r_end; i++) {
        const insertObj: LineChartDataset = {
          label: result.axisNames[i],
          data: [],
          borderColor: colors[i],
          backgroundColor: colors[i],
          borderWidth: 2,
        };

        //dataに各ラベルに対応する値を抽出して代入
        for (let j = 0; j < data.length; j++) {
          insertObj.data.push(data[j][i]);
        }

        datasetsFromResult.push(insertObj);
      }

      return datasetsFromResult;
    };

    /**
     * グラフのデータセット生成処理
     */
    const LineChartComponents = [];
    //全ての空間に対して走査
    for (let spaceID = 0; spaceID < result.data.length; spaceID++) {
      const chartJS_chartData = {
        labels: x_axis_label,
        datasets: createDataSets(spaceID, r_start, r_end),
      };

      const chartJS_options = {
        responsive: true,
        aspectRatio: 1.5,
        elements: {
          point: { radius: 0 },
        },
      };

      LineChartComponents.push(
        <div
          style={{ width: width + "px" }}
          key={`Space_${spaceID}_${props.range.start || 0}_${
            props.range.end || result.data.length - 1
          }`}
        >
          <Line
            data={chartJS_chartData}
            id={`chart_of_space_${spaceID}`}
            options={chartJS_options}
          />
          <p>Space {spaceID}</p>
        </div>
      );
    }

    return LineChartComponents;
  }, [result]);

  /**
   * 描画
   */
  const handleViewerWidth = () => {
    const w_col = result.config.params.spaceLength.col;
    switch (result.config.params.spaceConnectionType) {
      case "partial":
        return (width + config.View.Chart.gap.col) * w_col + "px";
      default:
        return width * 10 + "px";
    }
  };

  return (
    <div
      className="chart-view-container"
      style={{
        display: "flex",
        gap: "10px",
        padding: "100px",
        flexWrap: "wrap",
        width: handleViewerWidth(),
      }}
    >
      {results}
    </div>
  );
};

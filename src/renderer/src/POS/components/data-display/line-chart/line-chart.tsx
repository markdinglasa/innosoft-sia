import { colors } from "@shared/styles";
import { LineChart as EchartsLineChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { memo, useEffect } from 'react';
import { Container, Content, Title } from './styles';

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  EchartsLineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | LineSeriesOption
>;

// Import types separately for better safety if needed (but ComposeOption handles it)
import { LineSeriesOption } from 'echarts/charts';
import {
  DatasetComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption
} from 'echarts/components';

interface Data {
  month: string;
  amount: number;
}
export interface ChartProps {
    className?:string
  id?: string;
  title?: string;
  data: Data[];
  category?: string;
  isProgressReport?: boolean;
}

function LineChart(props: ChartProps) {
  const { className, title, data = [], category = 'NA' } = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let dataXType: string[] = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let dataXValue: number[] = [];

    data.map((record) => {
      dataXType.push(record.month);
      dataXValue.push(record.amount);
    });

    //data.forEach(({ month, amount }) => {salesData[ - 1] = NameCount;});

    useEffect(() => {
      const chartDom = document.getElementById('line-chart');
      const myChart = echarts.init(chartDom);

      const option = {
        lazyUpdate: true,
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: dataXType,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: category,
            type: 'line',
            data: dataXValue,
            smooth: true,
            itemStyle: {
              color: `${colors.primary}`,
            },
            lineStyle: {
              width: 2,
            },
          },
        ],

        grid: {
          top: '10%',
          bottom: '10%',
          left: '10%',
          right: '10%',
        },
      };

      myChart.setOption(option);

      const handleResize = () => {
        myChart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        myChart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }, [category, dataXType, dataXValue, title]);

    return (
      <Container className={className}>
        <Title>{title}</Title>
        <Content id="line-chart" />
      </Container>
    );
  }


export default memo(LineChart);

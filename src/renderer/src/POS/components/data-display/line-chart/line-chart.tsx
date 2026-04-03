import { colors } from "@shared/styles";
import * as echarts from 'echarts';
import { memo, useEffect } from 'react';
import { Container, Content, Title } from './styles';

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

export type EChartsOption = echarts.EChartsOption;

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

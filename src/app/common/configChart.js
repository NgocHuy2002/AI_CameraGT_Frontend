import React from 'react';
import { t } from 'i18next';

export function configPie(data, angleField, colorField, color, content, legend) {
  const dataReturn = {
    appendPadding: 10,
    data: data,
    angleField: angleField,
    colorField: colorField,
    color: color,
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: function formatter(v) {
          return ''.concat(v);
        },
      },
    },
    legend: legend,
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        fill: '#fff',
        fontSize: 0,
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}',
      autoHide: true,
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: function customHtml(container, view, datum) {
          return <span style={{ fontSize: 16, lineHeight: 2 }}>{datum ? datum.name || datum.type : t('TONG')}</span>;
        },
      },
      style: {
        fontSize: 12,
      },
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      { type: 'pie-statistic-active' },
      { type: 'element:click' },
    ],
    animation: false,
  };
  if (content) dataReturn.statistic.content = content;
  return dataReturn;
}

export function configColumnMul(data = [], xField, yField, seriesField) {
  return {
    data: data,
    isGroup: true,
    xField: xField,
    yField: yField,
    seriesField: seriesField,
    animation: false,
    interactions: [
      { type: 'element:click' },
    ],
    minColumnWidth: 30,
    maxColumnWidth: 40,
  };
}

export function configColumn(data = [], xField, yField, seriesField, color, meta = {}, rotate = '') {
  return {
    data: data,
    xField: xField,
    yField: yField,
    xAxis: {
      nice: true,
      label: {
        rotate: rotate ? rotate : '',
        offset: 30,
        style: {
          fill: '#aaa',
          fontSize: 12,
        },
      },
    },
    minColumnWidth: 40,
    maxColumnWidth: 40,
    seriesField: seriesField,
    colorField: 'color',
    color: color,
    meta: meta,
    animation: false,
  };

}

export function configColumnGroup(data = [], xField, yField, seriesField, color) {
  return {
    data: data,
    isGroup: true,
    xField: xField,
    yField: yField,
    seriesField: seriesField,
    dodgePadding: 2,
    minColumnWidth: 40,
    maxColumnWidth: 40,
    color: color,
  };

}

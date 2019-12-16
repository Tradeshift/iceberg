/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */

import { formatFloat, isNull } from './helpers';
import colors from './constants';

export const getChartData = (
    errors,
    abstains,
    corrects,
    minErrors,
    maxErrors,
    minAbstains,
    maxAbstains,
    minCorrects,
    maxCorrects,
) => ({
    datasets: [
        {
            pointRadius: 0,
            showLine: true,
            label: 'minErrors',
            backgroundColor: 'rgba(213, 93, 93, 0.2)',
            borderColor: 'rgba(213, 93, 93, 0)',
            data: minErrors,
            fill: '+2',
        },
        {
            pointRadius: 0,
            showLine: true,
            label: 'Error',
            borderColor: colors.lightred,
            data: errors,
            fill: false,
        },
        {
            pointRadius: 0,
            showLine: true,
            label: 'maxErrors',
            borderColor: 'rgba(213, 93, 93, 0)',
            data: maxErrors,
            fill: false,
        },
        {
            pointRadius: 0,
            showLine: true,
            label: 'minAbstains',
            backgroundColor: 'rgba(0, 176, 255, 0.2)',
            borderColor: 'rgba(0, 176, 255, 0)',
            data: minAbstains,
            fill: '+2',
        },
        {
            pointRadius: 0,
            showLine: true,
            label: 'Abstain',
            fill: false,
            borderColor: colors.blue,
            data: abstains,
        },
        {
            pointRadius: 0,
            showLine: true,
            label: 'maxAbstains',
            borderColor: 'rgba(0, 176, 255, 0)',
            data: maxAbstains,
            fill: false,
        },
        {
            pointRadius: 0,
            showLine: true,
            label: 'minCorrects',
            backgroundColor: 'rgba(142, 218, 101, 0.2)',
            borderColor: 'rgba(142, 218, 101, 0)',
            data: minCorrects,
            fill: '+2',
        },
        {
            pointRadius: 0,
            showLine: true,
            label: 'Correct',
            borderColor: colors.lightgreen,
            data: corrects,
            fill: false,
        },
        {
            pointRadius: 0,
            showLine: true,
            label: 'maxCorrects',
            borderColor: 'rgba(142, 218, 101, 0)',
            data: maxCorrects,
            fill: false,
        },
    ],
});

export const getChartOptions = (threshold, savedThreshold, handleOnDrag) => ({
    responsive: true,
    maintainAspectRatio: false,
    annotation: {
        drawTime: 'afterDraw',
        events: ['click', 'mouseover', 'mouseout'],
        annotations: [
            {
                type: isNull(savedThreshold) ? '' : 'line',
                mode: 'vertical',
                scaleID: 'x-axis-1',
                value: savedThreshold,
                borderColor: '#9AB1BB',
                borderWidth: 1,
                label: {
                    enabled: true,
                    content: `Saved: ${isNull(savedThreshold) ? '' : formatFloat(savedThreshold)}`,
                    fontFamily: 'Open Sans',
                    backgroundColor: '#E5EBEE',
                    fontColor: '#192226',
                    fontSize: 13,
                    yPadding: 12,
                    xPadding: 15,
                    cursor: 'col-resize',
                },
                draggable: false,
            },
            {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-1',
                value: threshold,
                borderColor: '#304249',
                borderWidth: 1,
                label: {
                    enabled: true,
                    content: `Threshold: ${formatFloat(threshold)}`,
                    fontFamily: 'Open Sans',
                    fontSize: 13,
                    cursor: 'col-resize',
                    yAdjust: isNull(savedThreshold) ? 0 : threshold >= savedThreshold ? -50 : 50,
                    yPadding: 12,
                    xPadding: 15,
                },
                draggable: true,
                onDrag: e => handleOnDrag(e),
                onMouseover: function () {
                    const element = this;
                    element.options.borderWidth = 3;
                    element.chartInstance.chart.canvas.style.cursor = 'ew-resize';
                    element.chartInstance.update();
                },
                onMouseout: function () {
                    const element = this;
                    element.options.borderWidth = 1;
                    element.chartInstance.chart.canvas.style.cursor = 'initial';
                    element.chartInstance.update();
                },
            }],
    },
    title: {
        display: false,
    },
    tooltips: {
        enabled: false,
    },
    hover: {
        mode: 'nearest',
        intersect: true,
    },
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'THRESHOLD',
                fontSize: 12,
                fontFamily: 'Open Sans',
                fontColor: '#192226',
                fontStyle: 'bold',
            },
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'PERCENT',
                fontSize: 12,
                fontFamily: 'Open Sans',
                fontColor: '#192226',
                fontStyle: 'bold',
            },
            ticks: {
                max: 100.5,
                min: -0.5,
                callback: function (value, index, values) {
                    if (value !== 100.5 && value !== -0.5) {
                        return values[index];
                    }
                },
            },
        }],
    },
    spanGaps: false,
    elements: {
        line: {
            tension: 0.000001,
        },
    },
    plugins: {
        filler: {
            propagate: false,
        },
        'samples-filler-analyser': {
            target: 'chart-analyser',
        },
    },
});

export const getLineData = costPoints => ({
    datasets: [{
        pointRadius: 0,
        showLine: true,
        label: 'Cost',
        backgroundColor: colors.lightorange,
        borderColor: colors.lightorange,
        data: costPoints,
        fill: false,
    }],
});

export const getLineOptions = (threshold, savedThreshold, handleOnDrag) => ({
    responsive: true,
    maintainAspectRatio: false,
    annotation: {
        drawTime: 'afterDraw',
        events: ['click', 'mouseover', 'mouseout'],
        annotations: [
            {
                type: isNull(savedThreshold) ? '' : 'line',
                mode: 'vertical',
                scaleID: 'x-axis-1',
                value: savedThreshold,
                borderColor: '#9AB1BB',
                borderWidth: 1,
                label: {
                    enabled: true,
                    content: `Saved: ${isNull(savedThreshold) ? '' : formatFloat(savedThreshold)}`,
                    fontFamily: 'Open Sans',
                    backgroundColor: '#E5EBEE',
                    fontColor: '#192226',
                    fontSize: 13,
                    yPadding: 12,
                    xPadding: 15,
                    cursor: 'col-resize',
                },
                draggable: false,
            },
            {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-1',
                value: threshold,
                borderColor: '#304249',
                borderWidth: 1,
                label: {
                    enabled: true,
                    content: `Threshold: ${formatFloat(threshold)}`,
                    fontFamily: 'Open Sans',
                    fontSize: 13,
                    cursor: 'col-resize',
                    yAdjust: isNull(savedThreshold) ? 0 : threshold >= savedThreshold ? -50 : 50,
                    yPadding: 12,
                    xPadding: 15,
                },
                draggable: true,
                onDrag: e => handleOnDrag(e),
                onMouseover: function () {
                    const element = this;
                    element.options.borderWidth = 3;
                    element.chartInstance.chart.canvas.style.cursor = 'ew-resize';
                    element.chartInstance.update();
                },
                onMouseout: function () {
                    const element = this;
                    element.options.borderWidth = 1;
                    element.chartInstance.chart.canvas.style.cursor = 'initial';
                    element.chartInstance.update();
                },
            }],
    },
    title: {
        display: false,
    },
    tooltips: {
        enabled: false,
    },
    hover: {
        mode: 'nearest',
        intersect: true,
    },
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'THRESHOLD',
                fontSize: 12,
                fontFamily: 'Open Sans',
                fontColor: '#192226',
                fontStyle: 'bold',
            },
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'COST',
                fontSize: 12,
                fontFamily: 'Open Sans',
                fontColor: '#192226',
                fontStyle: 'bold',
            },
        }],
    },
});

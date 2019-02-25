/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */

import { formatFloat, isNull } from './helpers';

export const getChartData = (errors, abstains, corrects) => ({
    datasets: [{
        pointRadius: 0,
        showLine: true,
        label: 'Error',
        backgroundColor: '#D55D5D',
        borderColor: '#D55D5D',
        data: errors,
        fill: false,
    }, {
        pointRadius: 0,
        showLine: true,
        label: 'Abstain',
        fill: false,
        backgroundColor: '#00B0FF',
        borderColor: '#00B0FF',
        data: abstains,
    }, {
        pointRadius: 0,
        showLine: true,
        label: 'Correct',
        fill: false,
        backgroundColor: '#8EDA65',
        borderColor: '#8EDA65',
        data: corrects,
    }],
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
                    element.chartInstance.update();
                    element.chartInstance.chart.canvas.style.cursor = 'ew-resize';
                },
                onMouseout: function () {
                    const element = this;
                    element.options.borderWidth = 1;
                    element.chartInstance.update();
                    element.chartInstance.chart.canvas.style.cursor = 'initial';
                },
            }],
    },
    title: {
        display: false,
    },
    tooltips: {
        mode: 'nearest',
        intersect: false,
    },
    hover: {
        mode: 'nearest',
        intersect: true,
    },
    legend: {
        display: true,
        position: 'top',
    },
    layout: {
        padding: {
            left: 20,
            right: 20,
        },
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
        }],
    },
});

export const getLineData = costPoints => ({
    datasets: [{
        pointRadius: 0,
        showLine: true,
        label: 'Cost',
        backgroundColor: '#FFB65C',
        borderColor: '#FFB65C',
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
                    element.chartInstance.update();
                    element.chartInstance.chart.canvas.style.cursor = 'ew-resize';
                },
                onMouseout: function () {
                    const element = this;
                    element.options.borderWidth = 1;
                    element.chartInstance.update();
                    element.chartInstance.chart.canvas.style.cursor = 'initial';
                },
            }],
    },
    title: {
        display: false,
    },
    tooltips: {
        mode: 'index',
        intersect: false,
    },
    hover: {
        mode: 'nearest',
        intersect: true,
    },
    legend: {
        display: true,
        position: 'top',
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

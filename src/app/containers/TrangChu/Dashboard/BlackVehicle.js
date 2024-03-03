import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';
import { Pie } from '@ant-design/plots';

function BlackVehicle({ isLoading, dataBlack, ...props }) {
    const data = [
        {
            type: 'Biển số đen',
            value: dataBlack?.countBlackList,
        },
        {
            type: 'Biển số khác',
            value: dataBlack?.countOther,
        }
    ];

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
    };
    return <Pie {...config} />;
}

function mapStateToProps(store) {
    const { isLoading } = store.app;
    return { isLoading };
}

export default withTranslation()(connect(mapStateToProps)(BlackVehicle));
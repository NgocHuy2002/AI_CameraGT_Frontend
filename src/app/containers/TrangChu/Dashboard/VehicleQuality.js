import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';
import { Column } from '@ant-design/plots';

function VehicleQuality({ isLoading, dataVehicleByDateType, ...props }) {
    const data = dataVehicleByDateType.map(item => ({
        date: item.date,
        type: t(`${item.type}`),
        value: item.value
    }));

    const config = {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
    };

    return <Column {...config} />;
}

function mapStateToProps(store) {
    const { isLoading } = store.app;
    return { isLoading };
}

export default withTranslation()(connect(mapStateToProps)(VehicleQuality));
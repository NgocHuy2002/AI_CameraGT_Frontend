import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "antd";
import { connect } from "react-redux";

import Loading from "@components/Loading";
import CustomModal from "@components/CustomModal";
import CustomSkeleton from "@components/CustomSkeleton";

import { CONSTANTS, RULES, VEHICLE_TYPE } from "@constants";
import { t } from "i18next";
import { withTranslation } from "react-i18next";

import * as unit from "@app/store/ducks/unit.duck";
import * as position from "@app/store/ducks/position.duck";

function CreateOrModify({ isModalVisible, handleOk, handleCancel, updateAllow, myInfo, permissions, formData, ...props }) {
    const { permission } = props;


    const [form] = Form.useForm();
    const [position, setPosition] = useState([]);

    useEffect(() => {
        if (formData) {
            fillFrom();
        }
    }, [formData]);
    const fillFrom = () => {
        form.setFieldsValue({
            licensePlates: formData.licensePlates,
            licensePlatesColor: formData.licensePlatesColor,
            vehicleType: formData.vehicleType,
        })
    }

    function onFinish(data) {
        if (props.isLoading) return;
        const dataRequest = { ...data };
        handleOk(CONSTANTS.CREATE, dataRequest);
    }
    const convertedArray = Object.keys(VEHICLE_TYPE).filter(key => key !== 'ALL').map(key => ({
        ...VEHICLE_TYPE[key]
    }));
    return (
        <>
            <CustomModal
                width="920px"
                title={t('CREATE_BLACK_LIST')}
                visible={isModalVisible}
                onCancel={handleCancel}
                isLoadingSubmit={props.isLoading}
                isDisabledClose={props.isLoading}
                formId="form-camera"
                showFooter={updateAllow}
                maskClosable={updateAllow}
            >
                <Loading active={props.isLoading}>
                    <Row>
                        <Col xs={24} md={24}>
                            <Form id="form-camera" size="default" form={form} onFinish={onFinish}>
                                <Row gutter={8}>
                                    <CustomSkeleton
                                        size="default"
                                        label={t("LICENSE_PLATES")}
                                        name="licensePlates"
                                        type={CONSTANTS.TEXT}
                                        layoutCol={{ xs: 12 }}
                                        labelCol={{ xs: 8, md: 7, lg: 8 }}
                                        rules={[RULES.REQUIRED]}
                                        form={form}
                                        showInputLabel={!updateAllow}
                                    />
                                    <CustomSkeleton
                                        size="default"
                                        label={t("LICENSE_PLATES_COLOR")}
                                        name="licensePlatesColor"
                                        type={CONSTANTS.SELECT}
                                        options={{
                                            data: [
                                                { value: 'Màu trắng', lable: 'Màu trắng' },
                                                { value: 'Màu đỏ', lable: 'Màu đỏ' }],
                                            valueString: "value",
                                            labelString: "lable",
                                        }}
                                        layoutCol={{ xs: 12 }}
                                        labelCol={{ xs: 8, md: 7, lg: 8 }}
                                        // rules={[RULES.REQUIRED]}
                                        form={form}
                                        showInputLabel={!updateAllow}
                                    />
                                    <CustomSkeleton
                                        size="default"
                                        label={t("VEHICLE_TYPE")}
                                        name="vehicleType"
                                        type={CONSTANTS.SELECT}
                                        options={{
                                            data: convertedArray,
                                            valueString: "value",
                                            labelString: "lable",
                                        }}
                                        layoutCol={{ xs: 24 }}
                                        labelCol={{ xs: 6, md: 6, lg: 4 }}
                                        rules={[RULES.REQUIRED]}
                                        form={form}
                                        showInputLabel={!updateAllow}
                                    />
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Loading>
            </CustomModal>
        </>
    );
}

function mapStateToProps(store) {
    const { isLoading } = store.app;
    const { unitList } = store.unit;
    const { positionList } = store.position;
    const { permissions } = store.user;
    return { isLoading, unitList, positionList, permissions };
}

const mapDispatchToProps = {
    ...unit.actions,
    ...position.actions,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CreateOrModify));

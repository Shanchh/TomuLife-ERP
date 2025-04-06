import { EditOutlined } from '@ant-design/icons'
import { Button, Flex, Modal } from 'antd'
import React, { useState } from 'react'
import PurchaseReportForm from '../Form/PurchaseReportForm';
import { PurchaseOrder } from '../../../types';

interface ModifyPruchaseOrderBtnProps {
    initialData: PurchaseOrder;
    refreshData: () => void;
}

const ModifyPruchaseOrderBtn: React.FC<ModifyPruchaseOrderBtnProps> = ({ initialData, refreshData }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <>
            <Button variant="link" color="default" onClick={() => setModalOpen(true)}>
                <EditOutlined />
            </Button>
            <Modal
                centered={false}
                open={modalOpen}
                width={600}
                onCancel={() => setModalOpen(false)}
                style={{ top: 100 }}
                footer={null}
            >
                <PurchaseReportForm initialData={initialData} setModalOpen={setModalOpen} refreshData={refreshData}/>
            </Modal>
        </>
    )
}

export default ModifyPruchaseOrderBtn
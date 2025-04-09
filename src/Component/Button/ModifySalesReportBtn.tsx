import React, { useState } from 'react'
import { Customer, Product, SalesReport } from '../../../types';
import { Button, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import SalesReportForm from '../Form/SalesReportForm';

interface ModifySalesReportBtnProps {
    initialData: SalesReport;
    refreshData: () => void;
    products: Product[];
    customers: Customer[];
}

const ModifySalesReportBtn: React.FC<ModifySalesReportBtnProps> = ({ initialData, refreshData, products, customers }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <>
            <Button variant="link" color="default" onClick={() => setModalOpen(true)}>
                <EditOutlined />
            </Button>
            <Modal
                centered={false}
                open={modalOpen}
                width={620}
                onCancel={() => setModalOpen(false)}
                style={{ top: 100 }}
                footer={null}
            >
                <SalesReportForm initialData={initialData} refreshData={refreshData} setModalOpen={setModalOpen} products={products} customers={customers}/>
            </Modal>
        </>
    )
}

export default ModifySalesReportBtn
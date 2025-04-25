import { EditOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import React, { useState } from 'react'
import { ActivityDetail } from '../../../types';
import ActivityReportForm from '../Form/ActivityReportForm';

interface ModifyActivityDetailBtnProps {
    initialData: ActivityDetail;
    refreshData: () => void;
}

const ModifyActivityDetailBtn: React.FC<ModifyActivityDetailBtnProps> = ({ initialData, refreshData }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <>
            <Button variant="link" color="default" onClick={() => setModalOpen(true)}>
                <EditOutlined />
            </Button>
            <Modal
                centered={false}
                open={modalOpen}
                width={1200}
                onCancel={() => setModalOpen(false)}
                style={{ top: 100 }}
                footer={null}
            >
                <ActivityReportForm initialData={initialData} refreshData={refreshData} setModalOpen={setModalOpen}/>
            </Modal>
        </>
    )
}

export default ModifyActivityDetailBtn
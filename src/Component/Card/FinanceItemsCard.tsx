import { Card, Form, Input, InputNumber, Button, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface FinanceItemsCardProps {
    title: string;
    fieldName: string;
}

const FinanceItemsCard: React.FC<FinanceItemsCardProps> = ({ title, fieldName }) => {
    return (
        <Card title={title} style={{ marginTop: 20 }}>
            <Form.List name={fieldName}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, idx) => (
                            <Row gutter={16} key={field.key} align="middle" style={{ marginBottom: 12 }}>
                                <Col span={2} style={{ textAlign: 'center' }}>
                                    <strong>{idx + 1}.</strong>
                                </Col>
                                <Col span={14}>
                                    <Form.Item
                                        name={[field.name, 'description']}
                                        fieldKey={field.fieldKey}
                                        rules={[{ required: true, message: '請輸入說明' }]}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Input placeholder="說明" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name={[field.name, 'amount']}
                                        fieldKey={field.fieldKey}
                                        rules={[{ required: true, message: '請輸入金額' }]}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <InputNumber placeholder="金額" min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={2} style={{ textAlign: 'center' }}>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Col>
                            </Row>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                新增項目
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Card>
    );
};

export default FinanceItemsCard;
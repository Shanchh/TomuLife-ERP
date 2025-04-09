import { Button, Card, Col, DatePicker, Flex, Form, Radio, Row } from 'antd'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import SalesPaymentSummaryCard from '../../Component/Card/SalesPaymentSummaryCard';
import PaymentMethodSummaryCard from '../../Component/Card/PaymentMethodSummaryCard';

const FinanceSalesStatistics = () => {
  const [form] = Form.useForm();
  const [timeSelected, setTimeSelected] = useState<string>("month");
  const [dateRange, setDateRange] = useState<{ start: number | null, end: number | null }>({
    start: dayjs().startOf('month').valueOf(),
    end: dayjs().endOf('month').valueOf()
  });

  const onFormSubmit = () => {
    const values = form.getFieldsValue();

    let start = null;
    let end = null;

    if (values.timeSelected === 'month') {
      const month = values.month;
      start = month?.startOf('month').valueOf() || null;
      end = month?.endOf('month').valueOf() || null;
    } else if (values.timeSelected === 'timeRange') {
      start = values.timeStartAt?.valueOf() || null;
      end = values.timeEndAt?.valueOf() || null;
    }

    setDateRange({ start, end });
  };

  return (
    <Flex vertical style={{ width: "100%" }} gap={8}>
      <Card>
        <Form
          form={form}
          onFinish={onFormSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col>
              <Flex align='center' gap={10}>
                <span>時間範圍選擇:</span>
                <Form.Item
                  noStyle
                  name="timeSelected"
                  initialValue="month"
                >
                  <Radio.Group value={timeSelected} onChange={(e => setTimeSelected(e.target.value))}>
                    <Radio.Button value="month">選擇月份</Radio.Button>
                    <Radio.Button value="timeRange">時間區間</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Flex>
            </Col>

            <Col>
              <Flex align='center' gap={10}>
                {
                  timeSelected === "month" ? (
                    <>
                      <span>選擇月份:</span>
                      <Form.Item
                        noStyle
                        name="month"
                        initialValue={dayjs()}
                      >
                        <DatePicker
                          picker="month"
                          format="YYYY-MM"
                          style={{ width: 200 }}
                          inputReadOnly
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <span>開始時間</span>
                      <Form.Item name={"timeStartAt"} initialValue={dayjs().startOf('month')} noStyle >
                        <DatePicker placeholder="請選擇" inputReadOnly />
                      </Form.Item>
                      <span>~ 結束時間</span>
                      <Form.Item name={"timeEndAt"} initialValue={dayjs()} noStyle>
                        <DatePicker placeholder="請選擇" inputReadOnly />
                      </Form.Item>
                    </>
                  )
                }
                <Button htmlType="submit" variant="solid">
                  送出查詢
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row gutter={[8, 8]} style={{ width: "100%" }}>
        <Col sm={24} md={24} lg={12}>
          <SalesPaymentSummaryCard dateRange={dateRange} />
        </Col>
        <Col sm={24} md={24} lg={12}>
          <PaymentMethodSummaryCard dateRange={dateRange} />
        </Col>
      </Row>
    </Flex>
  )
}

export default FinanceSalesStatistics
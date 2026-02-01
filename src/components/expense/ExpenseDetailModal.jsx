import { Row, Col, Button, Modal, Form, Input, Select, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { useSheet } from '../../utils/AppContext';
import ExpenseService from '../../services/expenseService';

const ExpenseDetailModal = (props) => {
    const { visible, onClose, onSubmit, currentExpense, lastIndex } = props;
    const [form] = Form.useForm();
    const { jars, categories, expenseSrcs, currentMonth } = useSheet();

    const handleSubmit = async (values) => {
        const expense = {
          name: values.name,
          note: values.note,
          amount: parseFloat(values.amount),
          jar_id: values.jar_id,
          date: values.date.format('DD/MM/YYYY'),
          category: values.category,
          expense_src_id: values.expense_src_id,
        };
        var res
        if (currentExpense?.id) {
            res = await ExpenseService.update(currentMonth, currentExpense.id, expense);
        } else {
            console.log("insert lastIndex", lastIndex);
            
            res = await ExpenseService.insert(currentMonth, lastIndex, expense);
        }
        if (!res.success) {
            messageApi.open({
                type: 'error',
                content: 'Cập nhật thất bại',
            });
            return;
        }
    
        onSubmit();
        handleCancel();
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={currentExpense ? 'Sửa chi tiêu' : 'Thêm chi tiêu'}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={currentExpense ? {
                    ...currentExpense,
                    date: dayjs(currentExpense.date)
                } : {
                    date: dayjs(),
                    category: categories?.data ? categories?.data[0]?.category : null,
                    jar_id: jars?.data ? jars?.data[0]?.jar_id : null,
                    expense_src_id: expenseSrcs?.data ? expenseSrcs?.data[0]?.expense_src_id : null,
                }}
            >
                <Form.Item
                    label="Tên khoản chi"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khoản chi' }]}
                >
                    <Input placeholder="Ví dụ: Mua hàng tạp hóa" size="large" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Số tiền"
                            name="amount"
                            rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                        >
                            <Input type="number" placeholder="0" size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày"
                            name="date"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                        >
                            <DatePicker style={{ width: '100%' }} size="large" format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                </Row>

                
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Loại chi tiêu"
                            name="category"
                            rules={[{ required: true, message: 'Vui lòng chọn loại chi tiêu' }]}
                        >
                            <Select placeholder="Chọn loại chi tiêu" size="large"
                                options={categories?.data?.map((item) => ({value: item.category, label: item.name}))}
                            ></Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Hũ chi tiêu"
                            name="jar_id"
                            rules={[{ required: true, message: 'Vui lòng chọn hũ' }]}
                        >
                            <Select placeholder="Chọn hũ" size="large"
                                options={jars?.data?.map((item) => ({value: item.jar_id, label: item.name}))}
                            ></Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Nguồn tiền"
                            name="expense_src_id"
                            rules={[{ required: true, message: 'Vui lòng chọn nguồn tiền' }]}
                        >
                            <Select placeholder="Chọn nguồn tiền" size="large"
                                options={expenseSrcs?.data?.map((item) => ({value: item.expense_src_id, label: item.name}))}
                            ></Select>
                        </Form.Item>
                        </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ghi chú"
                            name="note"
                        >
                            <Input placeholder="Ví dụ: Winmart" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            {currentExpense ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ExpenseDetailModal;
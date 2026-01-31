import { Card, Row, Col, Button, Modal, Form, Input, Select, DatePicker, List, Space, Badge, Progress } from 'antd';
import SettingService from '../../services/settingService';

const LimitJarModal = (props) => {
    const { visible, onClose, onSubmit, currentJar } = props;
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const jar = {
            id: currentJar.id,
          name: currentJar.name,
          limit: parseFloat(values.limit),
          jar_id: currentJar.jar_id,
        };
        var res = await SettingService.updateSettings('jar', jar);
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
            title={"Hũ " + (currentJar ? currentJar.name : '')}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={500}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={currentJar ?? {}}
            >
                <Form.Item
                    label="Giới hạn"
                    name="limit"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                >
                    <Input type="number" placeholder="0" size="large" />
                </Form.Item>

                <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            {currentJar ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LimitJarModal;
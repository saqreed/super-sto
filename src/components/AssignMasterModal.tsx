import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Button, message, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { appointmentsAPI } from '../api/appointments';
import { usersAPI } from '../api/users';
import type { AssignMasterRequest, User } from '../types';

interface AssignMasterModalProps {
  visible: boolean;
  appointmentId: string;
  currentMasterId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const AssignMasterModal: React.FC<AssignMasterModalProps> = ({
  visible,
  appointmentId,
  currentMasterId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [masters, setMasters] = useState<User[]>([]);
  const [mastersLoading, setMastersLoading] = useState(false);

  // Загрузка списка мастеров
  useEffect(() => {
    if (visible) {
      loadMasters();
    }
  }, [visible]);

  const loadMasters = async () => {
    try {
      setMastersLoading(true);
      const response = await usersAPI.getMasters();
      const mastersData = response.data.data || response.data || [];
      setMasters(Array.isArray(mastersData) ? mastersData : []);
    } catch (error) {
      console.error('Ошибка загрузки мастеров:', error);
      message.error('Ошибка загрузки списка мастеров');
      setMasters([]);
    } finally {
      setMastersLoading(false);
    }
  };

  const handleSubmit = async (values: { masterId: string; notes?: string }) => {
    try {
      setLoading(true);
      
      const data: AssignMasterRequest = {
        appointmentId,
        masterId: values.masterId,
        notes: values.notes,
      };

      await appointmentsAPI.assignMaster(data);
      
      message.success('Мастер успешно назначен на запись');
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      console.error('Ошибка назначения мастера:', error);
      message.error(error.response?.data?.message || 'Ошибка назначения мастера');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Назначить мастера"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          masterId: currentMasterId,
        }}
      >
        <Form.Item
          name="masterId"
          label="Выберите мастера"
          rules={[{ required: true, message: 'Выберите мастера' }]}
        >
          <Select
            placeholder="Выберите мастера"
            loading={mastersLoading}
            showSearch
            optionFilterProp="children"
            suffixIcon={<UserOutlined />}
            notFoundContent={mastersLoading ? <Spin size="small" /> : 'Мастера не найдены'}
          >
            {masters.map((master) => (
              <Select.Option key={master.id} value={master.id}>
                {master.firstName} {master.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="notes"
          label="Примечания"
        >
          <Input.TextArea
            placeholder="Дополнительные инструкции для мастера..."
            rows={3}
          />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={handleCancel} className="mr-2">
            Отмена
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            Назначить мастера
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignMasterModal; 
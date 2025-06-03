import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchLoyaltyData,
  fetchLoyaltyTransactions,
  spendLoyaltyPoints,
  LoyaltyTransaction,
} from '../../store/slices/loyaltySlice';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Tag,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Spin,
  Alert,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  TrophyOutlined,
  GiftOutlined,
  HistoryOutlined,
  StarOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const { Text, Title } = Typography;

const LoyaltyDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { level, points, transactions, levelBenefits, loading, error } = useAppSelector(
    state => state.loyalty
  );
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [showSpendModal, setShowSpendModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchLoyaltyData());
    dispatch(fetchLoyaltyTransactions());
  }, [dispatch]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'BRONZE':
        return <TrophyOutlined style={{ color: '#CD7F32' }} />;
      case 'SILVER':
        return <StarOutlined style={{ color: '#C0C0C0' }} />;
      case 'GOLD':
        return <CrownOutlined style={{ color: '#FFD700' }} />;
      case 'PLATINUM':
        return <CrownOutlined style={{ color: '#E5E4E2' }} />;
      default:
        return <TrophyOutlined />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BRONZE':
        return '#CD7F32';
      case 'SILVER':
        return '#C0C0C0';
      case 'GOLD':
        return '#FFD700';
      case 'PLATINUM':
        return '#E5E4E2';
      default:
        return '#8c8c8c';
    }
  };

  const getNextLevel = (currentLevel: string) => {
    const levels = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const getPointsToNextLevel = (currentLevel: string, currentPoints: number) => {
    const thresholds = {
      BRONZE: 100,
      SILVER: 500,
      GOLD: 1500,
      PLATINUM: 0, // Максимальный уровень
    };

    const nextLevel = getNextLevel(currentLevel);
    if (!nextLevel) return 0;

    return thresholds[nextLevel as keyof typeof thresholds] - currentPoints;
  };

  const getTransactionTypeTag = (transaction: LoyaltyTransaction) => {
    switch (transaction.type) {
      case 'EARNED':
        return <Tag color="green">+{transaction.points} баллов</Tag>;
      case 'SPENT':
        return <Tag color="red">-{transaction.points} баллов</Tag>;
      case 'BONUS':
        return <Tag color="gold">+{transaction.points} бонус</Tag>;
      case 'EXPIRED':
        return <Tag color="gray">-{transaction.points} истекли</Tag>;
      default:
        return <Tag>{transaction.points} баллов</Tag>;
    }
  };

  const handleSpendPoints = async (values: { points: number; description: string }) => {
    try {
      await dispatch(
        spendLoyaltyPoints({
          points: values.points,
          description: values.description,
        })
      ).unwrap();
      setShowSpendModal(false);
      form.resetFields();
    } catch (error) {
      console.error('Ошибка списания баллов:', error);
    }
  };

  const nextLevel = getNextLevel(level);
  const pointsToNext = getPointsToNextLevel(level, points);
  const progressPercent = nextLevel 
    ? ((points / (points + pointsToNext)) * 100) 
    : 100;

  if (loading && !level) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка загрузки программы лояльности"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <GiftOutlined /> Программа лояльности
      </Title>

      {/* Основная информация */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Текущий уровень"
              value={level}
              prefix={getLevelIcon(level)}
              valueStyle={{ color: getLevelColor(level) }}
            />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">{levelBenefits[level]?.description}</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Доступные баллы"
              value={points}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
              suffix="баллов"
            />
            <div style={{ marginTop: '16px' }}>
              <Button 
                type="primary" 
                size="small"
                disabled={points === 0}
                onClick={() => setShowSpendModal(true)}
              >
                Потратить баллы
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>
                {nextLevel ? `До уровня ${nextLevel}` : 'Максимальный уровень'}
              </Text>
            </div>
            {nextLevel ? (
              <>
                <Progress
                  percent={Math.round(progressPercent)}
                  strokeColor={getLevelColor(nextLevel)}
                  showInfo={false}
                />
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">
                    Осталось: {pointsToNext} баллов
                  </Text>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CrownOutlined style={{ fontSize: '24px', color: getLevelColor(level) }} />
                <br />
                <Text type="secondary">Вы достигли максимального уровня!</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Преимущества уровней */}
      <Card title="Преимущества уровней" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {Object.entries(levelBenefits).map(([levelName, benefits]) => (
            <Col span={6} key={levelName}>
              <Card
                size="small"
                style={{
                  backgroundColor: level === levelName ? '#f6ffed' : undefined,
                  borderColor: level === levelName ? '#52c41a' : undefined,
                }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    {getLevelIcon(levelName)}
                    <Text strong style={{ marginLeft: '8px', color: getLevelColor(levelName) }}>
                      {levelName}
                    </Text>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <Text>Скидка: {benefits.discountPercent}%</Text>
                  <Text>Множитель: ×{benefits.bonusMultiplier}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {benefits.description}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* История транзакций */}
      <Card
        title={
          <Space>
            <HistoryOutlined />
            История операций
          </Space>
        }
      >
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <HistoryOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <br />
            <Text type="secondary">Нет операций с баллами</Text>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={transactions}
            renderItem={(transaction) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      {transaction.description}
                      {getTransactionTypeTag(transaction)}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text type="secondary">
                        {formatDistanceToNow(new Date(transaction.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </Text>
                      {transaction.appointmentId && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Запись: #{transaction.appointmentId}
                        </Text>
                      )}
                      {transaction.expiryDate && (
                        <Text type="warning" style={{ fontSize: '12px' }}>
                          Истекают: {new Date(transaction.expiryDate).toLocaleDateString('ru-RU')}
                        </Text>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Модальное окно списания баллов */}
      <Modal
        title="Потратить баллы"
        open={showSpendModal}
        onCancel={() => setShowSpendModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSpendPoints}
        >
          <Form.Item
            name="points"
            label="Количество баллов"
            rules={[
              { required: true, message: 'Укажите количество баллов' },
              { 
                type: 'number', 
                min: 1, 
                max: points, 
                message: `Доступно: ${points} баллов` 
              },
            ]}
          >
            <InputNumber
              min={1}
              max={points}
              style={{ width: '100%' }}
              placeholder="Введите количество баллов"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Укажите описание операции' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Например: Скидка на диагностику"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Потратить баллы
              </Button>
              <Button onClick={() => setShowSpendModal(false)}>
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoyaltyDashboard; 
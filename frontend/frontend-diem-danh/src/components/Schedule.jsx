// src/components/Schedule.js
import React from "react";
import { Card, List, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Schedule = () => {
  const scheduleData = [
    { time: "08:00 - 10:00", subject: "Toán học" },
    { time: "10:15 - 12:15", subject: "Lập trình web" },
    { time: "13:30 - 15:30", subject: "Cơ sở dữ liệu" },
    { time: "15:45 - 17:45", subject: "Giải tích" },
  ];

  return (
    <Card
      title="Lịch học"
      style={{
        width: "100%",
        padding: "24px",
        borderRadius: "8px",
        minHeight: "520px",
      }}
    >
      <Title level={4}>Lịch học tuần này</Title>
      <List
        bordered
        dataSource={scheduleData}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.time}</Text>: {item.subject}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Schedule;

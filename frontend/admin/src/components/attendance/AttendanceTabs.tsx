import React, { useState } from "react";
import { Tabs } from "antd";

import StreamAttendance from "./StreamAttendance";
import ImageUpload from "./ImageUpload";
import AttendanceList from "./AttendanceList";

const { TabPane } = Tabs;

const AttendanceTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stream" | "upload" | "classList">("stream");

  return (
    <div className="attendance-container" style={{ maxWidth: 900, margin: "0 auto" }}>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as "stream" | "upload" | "classList")}
        type="line"
        size="middle"
      >
        <TabPane tab="Stream" key="stream">
          <StreamAttendance />
        </TabPane>

        <TabPane tab="Upload" key="upload">
          <ImageUpload />
        </TabPane>

        <TabPane tab="Class List" key="classList">
          <AttendanceList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AttendanceTabs;

import React, { useState } from "react";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";

import StreamAttendance from "./StreamAttendance";
import ImageUpload from "./ImageUpload";
import AttendanceList from "./AttendanceList";

const { TabPane } = Tabs;

const AttendanceTabs: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"stream" | "upload" | "classList">(
    "stream"
  );

  return (
    <div
      className="attendance-container"
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) =>
          setActiveTab(key as "stream" | "upload" | "classList")
        }
        type="line"
        size="middle"
      >
        <TabPane tab={t("tabs.live")} key="stream">
          {}
          <StreamAttendance active={activeTab === "stream"} />
        </TabPane>

        <TabPane tab={t("tabs.upload")} key="upload">
          <ImageUpload />
        </TabPane>

        <TabPane tab={t("tabs.overview")} key="classList">
          <AttendanceList activeTab={activeTab} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AttendanceTabs;

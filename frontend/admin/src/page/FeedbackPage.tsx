import React, { useState } from "react";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";

import FeedbackForm from "../components/feedback/FeedbackForm";
import FeedbackList from "../components/feedback/FeedbackList";
import "./FeedbackPage.css";

const { TabPane } = Tabs;

const FeedbackPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");

  return (
    <div className="feedback-page">
      <h2>{t("feedbackPage.title")}</h2>
      <div className="feedback-container">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "form" | "list")}
          type="line"
          size="middle"
        >
          <TabPane tab={t("feedbackPage.tabs.form")} key="form">
            <FeedbackForm />
          </TabPane>
          <TabPane tab={t("feedbackPage.tabs.list")} key="list">
            <FeedbackList activeTab={activeTab} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackPage;

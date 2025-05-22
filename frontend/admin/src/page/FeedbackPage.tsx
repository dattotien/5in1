import React, { useState } from "react";
import { Tabs } from "antd";

import FeedbackForm from "../components/feedback/FeedbackForm";
import FeedbackList from "../components/feedback/FeedbackList";
import './FeedbackPage.css';

const { TabPane } = Tabs;

const FeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");

  return (
    <div className="feedback-page">
      <h2>Feedback Hub</h2>
      <div className="feedback-container">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "form" | "list")}
          type="line"
          size="middle"
        >
          <TabPane tab="Submit Feedback " key="form">
            <FeedbackForm />
          </TabPane>
          <TabPane tab="Feedback History" key="list">
            <FeedbackList />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackPage;

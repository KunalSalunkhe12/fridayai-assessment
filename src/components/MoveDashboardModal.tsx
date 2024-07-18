import { useState } from "react";
import { Button, Modal } from "antd";
import SelectDashboard from "./SelectDashboard";

const MoveDashboardModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Move Dashboard Modal
      </Button>
      <Modal
        title="Move to Other Dashboard"
        className="move-dashboard-modal"
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <SelectDashboard setIsModalOpen={setIsModalOpen} />
      </Modal>
    </>
  );
};

export default MoveDashboardModal;

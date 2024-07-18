import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  AutoComplete,
  Input,
  Avatar,
  AutoCompleteProps,
  Segmented,
  Tag,
  Select,
  Empty,
} from "antd";
import {
  AppstoreOutlined,
  LinkOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { sharedFilters, sharedPermissions, users } from "../constant";
import { User } from "../types";

/* Filters user based on search query and return Autocomplete options*/
const searchResult = (query: string) => {
  const searchedUsers = users;

  return searchedUsers
    .filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    )
    .map((user) => {
      return {
        value: user.email,
        label: (
          <div className="autocomplete-item-container">
            <div className="autocomplete-item">
              <span>
                <Avatar src={<img src={user.avatarUrl} alt="avatar" />} />
              </span>
              <div className="autocomplete-name">
                <span>{user.name}</span>
                <span>{user.email}</span>
              </div>
            </div>
            <Button type="link">
              Invite <RightOutlined />
            </Button>
          </div>
        ),
      };
    });
};

const ShareDashboardModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  const [sharedFilter, setSharedFilter] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(selectedUsers);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleDone = () => {
    localStorage.setItem("sharedUsers", JSON.stringify(selectedUsers));
    console.log("Shared Users", selectedUsers);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  useEffect(() => {
    // Retrieve users from local storage
    const storedUsers = localStorage.getItem("sharedUsers");
    if (storedUsers) {
      setSelectedUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleAddUser = (email: string) => {
    const user = users.find((user) => user.email === email);
    if (!user) return;

    const isUserAlreadySelected = selectedUsers.some(
      (selectedUser) => selectedUser.email === email
    );
    if (isUserAlreadySelected) return;

    const updatedUsers = [...selectedUsers, { ...user, permission: "edit" }];
    setSelectedUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleRemoveUser = (user: User) => {
    const updatedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    setSelectedUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleUserPermissions = (user: User, permission: string) => {
    const updatedUsers = selectedUsers.map((selectedUser) => {
      if (selectedUser.id === user.id) {
        return { ...selectedUser, permission };
      }
      return selectedUser;
    });
    setSelectedUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleFilterChange = (filter: string) => {
    setSharedFilter(filter);

    let filteredUsers = selectedUsers;
    if (filter === "Editors") {
      filteredUsers = selectedUsers.filter(
        (user) => user.permission === "edit"
      );
    } else if (filter === "Viewers") {
      filteredUsers = selectedUsers.filter(
        (user) => user.permission === "view"
      );
    }
    setFilteredUsers(filteredUsers);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Share Dashboard
      </Button>
      <Modal
        centered
        className="share-dashboard-modal"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <p className="share-dashboard-title">Share this Dashboard</p>
        <p>Share your insights and collaborate with your team</p>
        <hr />

        <div className="audience-container">
          <AppstoreOutlined size={30} className="appstore-icon" />
          <span className="share-dashboard-subtitle">Audience</span>
        </div>

        <div className="copy-link-container">
          <div>
            <p>Invite members via a sharable link</p>
            <p>Anyone with the link can view</p>
          </div>
          <Button type="primary">
            <LinkOutlined /> Copy Link
          </Button>
        </div>

        <AutoComplete
          className="share-dashboard-autocomplete"
          options={options}
          onSearch={handleSearch}
          onSelect={handleAddUser}
          allowClear
        >
          <Input
            placeholder="Search for a member or a group to add"
            className="share-dashboard-input"
          />
        </AutoComplete>

        {selectedUsers.length > 0 && (
          <>
            <div className="shared-filters-container">
              <p>Shared with {selectedUsers.length} members</p>
              <Segmented
                options={sharedFilters}
                value={sharedFilter}
                onChange={handleFilterChange}
                size="middle"
              />
            </div>

            <div className="tag-container custom-scrollbar">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  return (
                    <div className="tag-item" key={user.id}>
                      <Tag
                        closable
                        onClose={() => handleRemoveUser(user)}
                        className="user-tag"
                      >
                        <Avatar size={20} src={user.avatarUrl} />
                        <span>{user.name}</span>
                      </Tag>
                      <Select
                        variant="borderless"
                        defaultValue="edit"
                        value={user.permission}
                        options={sharedPermissions}
                        onChange={(value) => handleUserPermissions(user, value)}
                      />
                    </div>
                  );
                })
              ) : (
                <Empty description="No users found" />
              )}
            </div>
          </>
        )}

        <div className="modal-footer">
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>
          <Button key="submit" type="primary" onClick={handleDone}>
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ShareDashboardModal;

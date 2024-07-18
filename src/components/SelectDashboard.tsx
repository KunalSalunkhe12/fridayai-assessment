import { Button, Input } from "antd";
import { useState } from "react";
import {
  SearchOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = {
  key: string;
  icon: JSX.Element;
  label: string;
  children?: MenuItem[];
};

type SelectDashboardProps = {
  setIsModalOpen?: (state: boolean) => void;
  dropdown?: boolean;
};

const items: MenuItem[] = [
  {
    key: "1",
    icon: <FolderOpenOutlined />,
    label: "Sales Overview",
    children: [
      { key: "11", icon: <AppstoreOutlined />, label: "Audience" },
      { key: "12", icon: <AppstoreOutlined />, label: "Payouts" },
    ],
  },
  {
    key: "2",
    icon: <FolderOpenOutlined />,
    label: "Marketing Dashboard",
    children: [
      { key: "21", icon: <AppstoreOutlined />, label: "Audience" },
      { key: "22", icon: <AppstoreOutlined />, label: "Payouts" },
      { key: "23", icon: <AppstoreOutlined />, label: "Recent Customers" },
    ],
  },
  {
    key: "3",
    icon: <FolderOpenOutlined />,
    label: "Finance Dashboards",
    children: [
      { key: "31", icon: <AppstoreOutlined />, label: "Audience" },
      { key: "32", icon: <AppstoreOutlined />, label: "Recent Customers" },
    ],
  },
  {
    key: "4",
    icon: <FolderOpenOutlined />,
    label: "HR Dashboards",
    children: [
      { key: "41", icon: <AppstoreOutlined />, label: "Audience" },
      { key: "42", icon: <AppstoreOutlined />, label: "Payouts" },
      { key: "43", icon: <AppstoreOutlined />, label: "Recent Customers" },
    ],
  },
];

interface LevelKeysProps {
  key?: string;
  label?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item && item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

const SelectDashboard = ({
  setIsModalOpen,
  dropdown,
}: SelectDashboardProps) => {
  const [stateOpenKeys, setStateOpenKeys] = useState(["1"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(
    null
  );

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const filteredItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .map((item) => {
        if (item.children) {
          const filteredChildren = filteredItems(item.children);
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
        }
        if (item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          return item;
        }
        return null;
      })
      .filter(Boolean) as MenuItem[];
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClick: MenuProps["onClick"] = (e) => {
    setSelectedDashboard(e.key);
  };

  const handleDone = () => {
    if (selectedDashboard) {
      console.log(`Selected Dashboard:  KEY ${selectedDashboard}`);
      setIsModalOpen && setIsModalOpen(false);
      setSearchTerm("");
    }
  };

  const handleCancel = () => {
    setIsModalOpen && setIsModalOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="select-dashboard">
      <Input
        className="search-dashboard-input"
        placeholder="Search dashboard"
        prefix={<SearchOutlined color="grey" />}
        value={searchTerm}
        onChange={handleSearch}
      />
      {filteredItems(items).length === 0 ? (
        <div className="no-dashboard">No dashboard found</div>
      ) : (
        <Menu
          className="select-dashboard-menu"
          mode="inline"
          openKeys={stateOpenKeys}
          onOpenChange={onOpenChange}
          onClick={handleClick}
          items={filteredItems(items)}
        />
      )}
      {!dropdown && (
        <div className="modal-footer">
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            disabled={selectedDashboard ? false : true}
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectDashboard;

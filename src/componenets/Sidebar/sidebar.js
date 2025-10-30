import { AreaChart } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// Simple icon replacements for lucide-react
const X = () => <span>✕</span>;
const Menu = () => <span>☰</span>;
const Home = () => <span>🏠</span>;
const Package = () => <span>📦</span>;
const ShoppingCart = () => <span>🛒</span>;
const CreditCard = () => <span>💳</span>;
const Truck = () => <span>🚛</span>;
const AlertCircle = () => <span>⚠️</span>;
const RefreshCcw = () => <span>🔄</span>;
const History = () => <span>📜</span>;
const Calendar = () => <span>📅</span>;
const Archive = () => <span>📁</span>;
const Clipboard = () => <span>📋</span>;
const AlertTriangle = () => <span>⚠️</span>;
const Tag = () => <span>🏷️</span>;
const Percent = () => <span>%</span>;
const Users = () => <span>👥</span>;
const FileText = () => <span>📄</span>;
const Settings = () => <span>⚙️</span>;
const HelpCircle = () => <span>❓</span>;
const ChevronRight = () => <span>›</span>;
const ChevronDown = () => <span>⌄</span>;
const ChevronUp = () => <span>⌃</span>;
const Edit = () => <span>✏️</span>;
const Plus = () => <span>➕</span>;

const Sidebar = ({ onSectionClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigate = useNavigate();

  // Initialize user from localStorage - same as AdminDashboard
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (storedUser && accessToken) {
      const userData = JSON.parse(storedUser);
      console.log("🔍 SIDEBAR INITIALIZATION:");
      console.log("   Stored user data:", userData);
      console.log("   User role:", userData.role);
      console.log("   User components:", userData.components);
      console.log("   User categories:", userData.categories);
      setCurrentUser(userData);
    }
  }, []);

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", checkIfMobile);
    checkIfMobile();

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleAdmin = () => {
    setAdminOpen(!adminOpen);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };
  const handleClick = () => {
    navigate("/dashboard");
  };
  const handleSectionClick = (sectionId, path) => {
    if (path) {
      window.location.href = path;
    } else if (onSectionClick) {
      onSectionClick(sectionId);
    }

    // Auto close sidebar on mobile after selection
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Check if user has access to a component - same logic as AdminDashboard
  const hasAccess = useCallback(
    (componentId) => {
      if (!currentUser) {
        console.log("❌ hasAccess: No current user");
        return false;
      }

      // Super admin has access to everything
      if (
        currentUser.role === "super_admin" ||
        currentUser.roleName === "super_admin"
      ) {
        console.log(
          `✅ hasAccess: Super admin accessing component ${componentId}`
        );
        return true;
      }

      // Check if user's components array includes this component ID
      const userComponents = currentUser.components || [];
      const hasComponentAccess = userComponents.includes(String(componentId));

      console.log(`🔍 hasAccess Check for component ${componentId}:`);
      console.log(`   User: ${currentUser.username}`);
      console.log(`   User components: [${userComponents.join(", ")}]`);
      console.log(`   Component ID: ${componentId}`);
      console.log(`   Has access: ${hasComponentAccess}`);

      return hasComponentAccess;
    },
    [currentUser]
  );

  // Function to format long text into multiple lines - keeping the same formatting
  const formatMenuText = (text) => {
    if (!text) return "";

    if (text === "Orders to cart not ordered yet ( everyone )") {
      return (
        <>
          <span className="block">Orders to cart</span>
          <span className="block">not ordered yet ( everyone )</span>
        </>
      );
    } else if (
      text === "Transaction control... paid / or not ( articial emp finance )"
    ) {
      return (
        <>
          <span className="block">Transaction control...</span>
          <span className="block">paid / or not ( articial emp finance )</span>
        </>
      );
    } else if (
      text === "Order management delivery ( driver and emp on filing delivery )"
    ) {
      return (
        <>
          <span className="block">Order management delivery</span>
          <span className="block">( driver and emp on filing delivery )</span>
        </>
      );
    } else if (
      text === "Non-delivered orders or issues ( office...complain office )"
    ) {
      return (
        <>
          <span className="block">Non-delivered orders or issues</span>
          <span className="block">( office...complain office )</span>
        </>
      );
    } else if (
      text ===
      "Inventory check ( just controlling staff to double check and corret )"
    ) {
      return (
        <>
          <span className="block">Inventory check</span>
          <span className="block">
            ( just controlling staff to double check and corret )
          </span>
        </>
      );
    } else if (text === "All Orders ( emp office ) ( everyone allows )") {
      return (
        <>
          <span className="block">All Orders</span>
          <span className="block">( emp office ) ( everyone allows )</span>
        </>
      );
    } else if (text === "Product list everyone ( View can only check )") {
      return (
        <>
          <span className="block">Product list everyone</span>
          <span className="block">( View can only check )</span>
        </>
      );
    }

    return text;
  };

  // Admin sub items with permission checking
  const adminSubItems = [
    {
      id: "admin-lower",
      componentId: "admin-lower",
      number: "1.",
      name: "lower admin",
      path: "/admin/lower",
      icon: <Settings />,
    },
    {
      id: "admin-drivers",
      componentId: "admin-drivers",
      number: "2.",
      name: "truck drivers",
      path: "/admin/drivers",
      icon: <Truck />,
    },
    {
      id: "admin-employee",
      componentId: "admin-employee",
      number: "3.",
      name: "employee",
      icon: <Users />,
      subItems: [
        {
          id: "admin-employee-add",
          componentId: "admin-employee-add",
          name: "a. add",
          path: "/admin/employee/add",
          icon: <Plus />,
        },
        {
          id: "admin-employee-edit",
          componentId: "admin-employee-edit",
          name: "b. edit",
          path: "/admin/employee/edit",
          icon: <Edit />,
        },
      ],
    },
    {
      id: "admin-supplier",
      componentId: "admin-supplier",
      number: "4.",
      name: "supplier",
      icon: <Users />,
      subItems: [
        {
          id: "admin-supplier-add",
          componentId: "admin-supplier-add",
          name: "a. add supplier",
          path: "/admin/supplier/add",
          icon: <Plus />,
        },
        {
          id: "admin-supplier-edit",
          componentId: "admin-supplier-edit",
          name: "b. edit supplier",
          path: "/admin/supplier/edit",
          icon: <Edit />,
        },
      ],
    },
    {
      id: "admin-customer",
      componentId: "admin-customer",
      number: "5.",
      name: "customer",
      icon: <Users />,
      subItems: [
        {
          id: "admin-customer-edit",
          componentId: "admin-customer-edit",
          name: "a. edit",
          path: "/admin/customer/edit",
          icon: <Edit />,
        },
      ],
    },
    {
      id: "admin-products",
      componentId: "admin-products",
      number: "6.",
      name: "Products",
      path: "/admin/Products",
      icon: <Package />,
    },
    {
      id: "delivery-areas",
      componentId: "admin-delivery-control",
      number: "7.",
      name: "Delivery Areas",
      path: "/admin/delivery-areas",
      icon: <AreaChart />,
    },
    {
      id: "delivery-types",
      componentId: "admin-delivery-control",
      number: "7.",
      name: "Delivery Types",
      path: "/admin/delivery-types",
    },
  ];

  // Section groups with component IDs for permission checking
  const sectionGroups = [
    {
      title: "OUR OPERATION",
      sections: [
        {
          id: 1,
          componentId: "1",
          number: "1.",
          icon: <ShoppingCart />,
          name: "Orders to cart not ordered yet ( everyone )",
          access: "",
          path: "/ordersINcart",
        },
        {
          id: 2,
          componentId: "2",
          number: "2.",
          icon: <CreditCard />,
          name: "Transaction control... paid / or not ( articial emp finance )",
          access: "Approval to paid and disapprove",
          note: "confirmed orders and paid",
          path: "/Transactions-control",
        },
        {
          id: 3,
          componentId: "3",
          number: "3.",
          icon: <Clipboard />,
          name: "All Orders ( emp office ) ( everyone allows )",
          access: "",
          path: "/all-orders",
        },
        {
          id: 4,
          componentId: "4",
          number: "4.",
          icon: <Package />,
          name: "Order management delivery ( driver and emp on filing delivery )",
          access: "Customer will pickup Order management",
          path: "/delivery-orders",
        },
        {
          id: 5,
          componentId: "5",
          number: "5.",
          icon: <Truck />,
          name: "Delivery ( driver and office emp )",
          access: "",
          path: "/Delivery",
        },
        {
          id: 6,
          componentId: "6",
          number: "6.",
          icon: <AlertCircle />,
          name: "Non-delivered orders or issues ( office...complain office )",
          access: "",
          path: "/non-delivered-orders",
        },
        {
          id: 7,
          componentId: "7",
          number: "7.",
          icon: <RefreshCcw />,
          name: "Refund / complain ( office...complain office )",
          access: "",
          path: "/view-refunds",
        },
        {
          id: 8,
          componentId: "8",
          number: "8.",
          icon: <History />,
          name: "History orders same # 3",
          access: "",
          path: "/all-orders",
        },
        {
          id: 9,
          componentId: "9",
          number: "9.",

          name: "Delivery system",
          access: "",
          path: "/delivery-system",
        },
        {
          id: 10,
          componentId: "10",
          number: "10.",

          name: "Videos Management",
          access: "",
          path: "/videos-management",
        },
      ],
    },
    {
      title: "VENDOR MANAGEMENT",
      sections: [
        {
          id: 15,
          componentId: "15",
          number: "15.",

          name: "Vendor Dashboard",
          access: "",
          path: "/vendor-dashboard",
        },

        {
          id: 16,
          componentId: "16",
          number: "16.",

          name: "Vendor outsource Dashboard",
          access: "",
          path: "/vendor-preorder-dashboard",
        },
      ],
    },
    {
      title: "STOCK",
      sections: [
        {
          id: 28,
          componentId: "28",
          number: "31.",
          icon: <Archive />,
          name: "Product list everyone ( View can only check )",
          access: "",
          path: "/admin/Products",
        },
        {
          id: 33,
          componentId: "33",
          number: "33.",
          icon: <Clipboard />,
          name: "Inventory check ( just controlling staff to double check and corret )",
          access: "",
          path: "/inventory-check",
        },
        {
          id: 35,
          componentId: "35",
          number: "35.",
          icon: <AlertTriangle />,
          name: "Out of Stock...order stock",
          access: "",
          path: "/out-of-stock",
        },
        {
          id: 36,
          componentId: "36",
          number: "36.",
          name: "Sales data for products",
          access: "",
          path: "/sales-data",
        },
        {
          id: 37,
          componentId: "37",
          number: "37.",
          name: "Lost Stock Management",
          access: "",
          path: "/lost-stock",
        },
      ],
    },
    {
      title: "STOCK 2",
      sections: [
        {
          id: 61,
          componentId: "61",
          number: "51.",
          icon: <Package />,
          name: "Create a new product (articial emp)",
          access: "",
          path: "/add-product",
        },
        {
          id: 54,
          componentId: "54",
          number: "54.",
          icon: <Package />,
          name: "Fill inventory (articial emp)",
          access: "",
          path: "/Fill-inventory",
        },
        {
          id: 55,
          componentId: "55",
          number: "55.",
          icon: <Clipboard />,
          name: "Inventory control (articial emp)",
          access: "",
          path: "/inventory-control",
        },
        {
          id: 56,
          componentId: "56",
          number: "56.",
          icon: <Tag />,
          name: "Categories",
          access: "",
          path: "/add-category",
        },
      ],
    },
    {
      title: " DISCOUNT",
      sections: [
        {
          id: 71,
          componentId: "71",
          number: "71.",
          icon: <Percent />,
          name: "Create discount (articial emp)",
          access: "",
          path: "/create-discount",
        },
        {
          id: 72,
          componentId: "72",
          number: "72.",
          icon: <Percent />,
          name: "All Discount list, everyone )",
          access: "",
          path: "/all-discounts",
        },
        {
          id: 73,
          componentId: "73",
          number: "73.",
          icon: <Percent />,
          name: "Discounted product inventory",
          access: "",
          path: "/discount-inventory",
        },
        {
          id: 74,
          componentId: "74",
          number: "74.",
          icon: <FileText />,
          name: "Discount policies action (articial emp)",
          access: "",
          highlight: true,
          path: "/discount-policies",
        },
      ],
    },
    {
      title: " SUPLIER EMP, CUSTOMER",
      sections: [
        {
          id: 81,
          componentId: "81",
          number: "81.",
          icon: <Users />,
          name: "Suppliers (articial emp)",
          path: "/view-suppliers",
          access: "",
        },
        {
          id: 82,
          componentId: "82",
          number: "82.",
          icon: <Users />,
          name: "employees (articial emp)",
          path: "/all-employees",
          access: "",
        },
        {
          id: 83,
          componentId: "83",
          number: "83.",
          icon: <Users />,
          name: "Customers ( articial emp )",
          access: "Timeline chat All orders",
          path: "/customers",
        },
      ],
    },
    {
      title: " HISTORY",
      sections: [
        {
          id: 90,
          componentId: "90",
          number: "90.",
          icon: <History />,
          name: "History orders supplier (Admin office)",
          access: "",
          path: "/supplier-history",
        },
      ],
    },
    {
      title: " FINANCE",
      sections: [
        {
          id: 101,
          componentId: "101",
          number: "101.",
          icon: <CreditCard />,
          name: "Finances (articial emp)",
          access: "",
          path: "/finances",
        },
        {
          id: 105,
          componentId: "105",
          number: "105.",
          icon: <CreditCard />,
          name: "ANALYTICS",
          access: "",
          path: "/analytics",
        },
      ],
    },
    {
      title: " LOWER ADMIN",
      sections: [
        {
          id: 100,
          componentId: "admin",
          number: "100.",
          icon: <Settings />,
          name: "Admin",
          access: "",
          isCollapsible: true,
          onClick: toggleAdmin,
        },
      ],
    },
    {
      title: " REFERRAL",
      sections: [
        {
          id: 150,
          componentId: "150",
          number: "150.",
          icon: <Users />,
          name: "Referrals video verification",
          access: "Video verification & sharing discount for each referral",
          path: "/referrals",
        },
        {
          id: 151,
          componentId: "151",
          number: "151.",
          icon: <Users />,
          name: "Referrals data",
          access: "Video verification & sharing discount for each referral",
          path: "/referrals-data",
        },
        {
          id: 155,
          componentId: "155",
          number: "155.",
          icon: <Users />,
          name: "Referrals foreman income",
          access: "Video verification & sharing discount for each referral",
          path: "/referals-foreman",
        },
        {
          id: 159,
          componentId: "159 A",
          number: "159 A",
          icon: <Users />,
          name: "Referral demo video ",
          access: "Video sending",
          path: "/referral-demovideo",
        },
        {
          id: 159,
          componentId: "159 B",
          number: "159 B.",
          icon: <Users />,
          name: "Intoduction videos Management",
          access: "Video sending",
          path: "/intro-videos",
        },
      ],
    },
    {
      title: " FOREMAN",
      sections: [
        {
          id: 160,
          componentId: "160",
          number: "160.",
          icon: <Users />,
          name: "from human earning structure",
          access: "",
          path: "/foreman-earnings",
        },
      ],
    },
    {
      title: "SETTINGS",
      sections: [
        {
          id: "settings",
          componentId: "settings",
          icon: <Settings />,
          name: "Settings",
          isCollapsible: true,
          onClick: toggleSettings,
        },
      ],
    },
    {
      title: "SUPPORT",
      sections: [
        {
          id: "support",
          componentId: "support",
          icon: <HelpCircle />,
          name: "Support",
          access: "",
          path: "/support",
        },
      ],
    },
  ];

  // Filter section groups based on user access
  const filteredSectionGroups = useMemo(() => {
    if (!currentUser) {
      console.log("❌ No current user - showing empty sidebar");
      return [];
    }

    console.log("🔍 FILTERING SIDEBAR SECTIONS:");
    console.log(`   User: ${currentUser.username}`);
    console.log(
      `   User components: [${(currentUser.components || []).join(", ")}]`
    );

    return sectionGroups
      .map((group) => {
        const filteredSections = group.sections.filter((section) => {
          // Special handling for admin section - check if user has access to any admin component
          if (section.componentId === "admin") {
            const hasAnyAdminAccess = adminSubItems.some((item) => {
              if (item.subItems) {
                return item.subItems.some((subItem) =>
                  hasAccess(subItem.componentId)
                );
              }
              return hasAccess(item.componentId);
            });
            return hasAnyAdminAccess;
          }

          // Special handling for settings and support - check for specific components
          if (section.componentId === "settings") {
            return hasAccess("calendar");
          }
          if (section.componentId === "support") {
            return hasAccess("support");
          }

          return hasAccess(section.componentId);
        });

        return {
          ...group,
          sections: filteredSections,
        };
      })
      .filter((group) => group.sections.length > 0); // Only show groups that have accessible sections
  }, [currentUser, hasAccess]);

  // Filter admin sub items based on user access
  const filteredAdminSubItems = useMemo(() => {
    if (!currentUser) return [];

    return adminSubItems
      .filter((item) => {
        if (item.subItems) {
          const filteredSubItems = item.subItems.filter((subItem) =>
            hasAccess(subItem.componentId)
          );
          return filteredSubItems.length > 0;
        }
        return hasAccess(item.componentId);
      })
      .map((item) => {
        if (item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter((subItem) =>
              hasAccess(subItem.componentId)
            ),
          };
        }
        return item;
      });
  }, [currentUser, hasAccess]);

  // Show loading state if no user
  if (!currentUser) {
    return (
      <>
        {/* Mobile toggle */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden bg-black text-white p-2 rounded-full"
        >
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-900 text-gray-200 transition-all z-40 shadow-xl overflow-y-auto ${
            isOpen ? "w-80" : "w-0"
          }`}
        >
          <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-center items-center sticky top-0">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 mr-14 h-full bg-gray-900 text-gray-200 transition-all z-40 shadow-xl overflow-y-auto ${
          isOpen ? "w-80" : "w-0"
        }`}
      >
        <div
          style={{
            display: "flex",

            marginTop: "6px",
          }}
        >
          <button
            onClick={handleClick}
            style={{
              padding: "10px 17px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px", // Space between text and arrow
            }}
          >
            ← back to Dashboard
          </button>
        </div>
        {/* Header */}
        <div className="p-4 lg:p-6 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-3 text-white text-lg lg:text-xl font-bold">
            <span className="text-blue-400 text-2xl">
              <Home />
            </span>
            <div>
              <span className="text-xs text-gray-300 font-normal">
                {currentUser.roleDisplayName || currentUser.role || "User"}
              </span>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {(currentUser.username || "U").charAt(0).toUpperCase()}
            </div>
            <span className="truncate flex-1">{currentUser.username}</span>
            <span className="whitespace-nowrap">
              {(currentUser.components || []).length} components
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="p-3">
          {filteredSectionGroups.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-gray-400 text-4xl mb-2">
                  <AlertCircle />
                </div>
                <h3 className="text-sm font-medium text-gray-300 mb-1">
                  No Access
                </h3>
                <p className="text-xs text-gray-500">
                  You don't have access to any components. Contact your
                  administrator.
                </p>
              </div>
            </div>
          ) : (
            filteredSectionGroups.map((group, gi) => (
              <div key={gi} className="mb-6">
                <div className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium uppercase bg-gray-800 rounded-md mb-2">
                  {group.title}
                </div>
                <div className="space-y-1 ml-1 lg:ml-2">
                  {group.sections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => {
                          if (section.isCollapsible) section.onClick();
                          else if (section.path)
                            handleSectionClick(section.id, section.path);
                          else handleSectionClick(section.id);
                        }}
                        className={`
                          w-full text-left px-3 lg:px-4 py-2 flex items-center gap-2 lg:gap-3 rounded-md transition-colors text-sm
                          ${
                            section.highlight
                              ? "bg-gray-700 border-l-2 border-purple-500"
                              : ""
                          }
                          ${
                            (section.isCollapsible &&
                              section.id === 100 &&
                              adminOpen) ||
                            (section.isCollapsible &&
                              section.id === "settings" &&
                              settingsOpen)
                              ? "bg-gray-700"
                              : "hover:bg-gray-800"
                          }
                          ${
                            section.path || section.isCollapsible
                              ? "cursor-pointer"
                              : ""
                          }
                        `}
                      >
                        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                          {section.number && (
                            <span className="text-green-400 text-xs lg:text-sm">
                              {section.number}
                            </span>
                          )}
                          <span className="text-blue-400">{section.icon}</span>
                        </div>
                        <div className="flex-1 flex justify-between items-center min-w-0">
                          <span className="text-xs lg:text-sm font-medium">
                            {formatMenuText(section.name)}
                          </span>
                          <div className="flex-shrink-0 ml-2">
                            {section.isCollapsible && section.id === 100 ? (
                              adminOpen ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )
                            ) : section.isCollapsible &&
                              section.id === "settings" ? (
                              settingsOpen ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )
                            ) : section.path ? (
                              <ChevronRight />
                            ) : null}
                          </div>
                        </div>
                      </button>

                      {/* Admin Submenu */}
                      {section.id === 100 && adminOpen && (
                        <div className="ml-6 lg:ml-8 mt-1 space-y-1 border-l border-gray-700 pl-2">
                          {filteredAdminSubItems.map((item) => (
                            <div key={item.id}>
                              <button
                                onClick={() =>
                                  handleSectionClick(item.id, item.path)
                                }
                                className="w-full text-left px-2 lg:px-3 py-2 flex items-center gap-2 rounded-md hover:bg-gray-800 transition-colors text-xs lg:text-sm"
                              >
                                {item.number && (
                                  <span className="text-green-400 text-xs">
                                    {item.number}
                                  </span>
                                )}
                                <span className="text-blue-400">
                                  {item.icon}
                                </span>
                                <span className="text-gray-300 truncate">
                                  {item.name}
                                </span>
                              </button>

                              {/* Third level */}
                              {item.subItems && (
                                <div className="ml-3 lg:ml-4 mt-1 space-y-1 border-l border-gray-700 pl-2">
                                  {item.subItems.map((sub) => (
                                    <button
                                      key={sub.id}
                                      onClick={() =>
                                        handleSectionClick(sub.id, sub.path)
                                      }
                                      className="w-full text-left px-2 lg:px-3 py-2 flex items-center gap-2 rounded-md hover:bg-gray-800 transition-colors text-xs lg:text-sm"
                                    >
                                      <span className="text-blue-400">
                                        {sub.icon}
                                      </span>
                                      <span className="text-gray-300 truncate">
                                        {sub.name}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Settings Submenu */}
                      {section.id === "settings" && settingsOpen && (
                        <div className="ml-6 lg:ml-8 mt-1 space-y-1 border-l border-gray-700 pl-2">
                          {hasAccess("calendar") && (
                            <button
                              onClick={() =>
                                handleSectionClick("calendar", "/calendar")
                              }
                              className="w-full text-left px-2 lg:px-3 py-2 flex items-center gap-2 rounded-md hover:bg-gray-800 transition-colors text-xs lg:text-sm"
                            >
                              <span className="text-blue-400">
                                <Calendar />
                              </span>
                              <span className="text-gray-300">Calendar</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Footer */}
          <div className="mt-8 p-3 lg:p-4 bg-gray-800 rounded-lg text-gray-400 text-xs">
            <div className="text-center">© 2025 Company Name — v2.3.1</div>
            <div className="text-center mt-2 text-gray-500">
              {currentUser.username} • {(currentUser.components || []).length}{" "}
              components accessible
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

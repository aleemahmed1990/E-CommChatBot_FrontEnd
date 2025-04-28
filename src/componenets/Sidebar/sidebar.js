import React, { useState, useEffect } from "react";
import {
  X,
  Menu,
  LogOut,
  Home,
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  AlertCircle,
  RefreshCcw,
  History,
  Archive,
  Clipboard,
  AlertTriangle,
  Tag,
  Percent,
  Users,
  FileText,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
} from "lucide-react";

const Sidebar = ({ onSectionClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

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

  const handleSectionClick = (sectionId, path) => {
    if (path) {
      // If path is provided, navigate to that path
      window.location.href = path;
    } else if (onSectionClick) {
      // Otherwise use the callback
      onSectionClick(sectionId);
    }

    // Auto close sidebar on mobile after selection
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log("User logged out");
    window.location.href = "/";
  };

  // Function to format long text into multiple lines
  const formatMenuText = (text) => {
    if (!text) return "";

    // For specific cases, manually format text
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

    // Default case for texts that aren't specifically formatted
    return text;
  };

  const adminSubItems = [
    {
      id: "admin-lower",
      number: "1.",
      name: "lower admin",
      path: "/admin/lower",
      icon: <Settings size={16} />,
    },
    {
      id: "admin-drivers",
      number: "2.",
      name: "truck drivers",
      path: "/admin/drivers",
      icon: <Truck size={16} />,
    },
    {
      id: "admin-employee",
      number: "3.",
      name: "employee",

      icon: <Users size={16} />,
      subItems: [
        {
          id: "admin-employee-add",
          name: "a. add",
          path: "/admin/employee/add",
          icon: <Plus size={14} />,
        },
        {
          id: "admin-employee-edit",
          name: "b. edit",
          path: "/admin/employee/edit",
          icon: <Edit size={14} />,
        },
      ],
    },
    {
      id: "admin-supplier",
      number: "4.",
      name: "supplier",
      path: "/admin/supplier",
      icon: <Users size={16} />,
      subItems: [
        {
          id: "admin-supplier-add",
          name: "a. add supplier",
          path: "/admin/supplier/add",
          icon: <Plus size={14} />,
        },
        {
          id: "admin-supplier-edit",
          name: "b. edit supplier",
          path: "/admin/supplier/edit",
          icon: <Edit size={14} />,
        },
      ],
    },

    {
      id: "admin-customer",
      number: "5.",
      name: "customer",
      path: "/admin/customer",
      icon: <Users size={16} />,
      subItems: [
        {
          id: "admin-customer-edit",
          name: "a. edit",
          path: "/admin/customer/edit",
          icon: <Edit size={14} />,
        },
      ],
    },
    {
      id: "admin-products",
      number: "6.",
      name: "Products",
      path: "/admin/Products",
      icon: <Users size={16} />,
    },
  ];

  const sectionGroups = [
    {
      title: "OUR OPERATION",
      sections: [
        {
          id: 1,
          number: "1.",
          icon: <ShoppingCart size={18} />,
          name: "Orders to cart not ordered yet ( everyone )",
          access: "",
          path: "/ordersINcart",
        },
        {
          id: 2,
          number: "2.",
          icon: <CreditCard size={18} />,
          name: "Transaction control... paid / or not ( articial emp finance )",
          access: "Approval to paid and disapprove",
          note: "confirmed orders and paid",
          path: "/Transactions-control",
        },
        {
          id: 3,
          number: "3.",
          icon: <Clipboard size={18} />,
          name: "All Orders ( emp office ) ( everyone allows )",
          access: "",
          path: "/all-orders",
        },
        {
          id: 4,
          number: "4.",
          icon: <Package size={18} />,
          name: "Order management delivery ( driver and emp on filing delivery )",
          access: "Customer will pickup Order management",
          path: "/delivery-orders",
        },
        {
          id: 5,
          number: "5.",
          icon: <Truck size={18} />,
          name: "Delivery ( driver and office emp )",
          access: "",
          path: "/Delivery",
        },
        {
          id: 6,
          number: "6.",
          icon: <AlertCircle size={18} />,
          name: "Non-delivered orders or issues ( office...complain office )",
          access: "",
          path: "/non-delivered-orders",
        },
        {
          id: 7,
          number: "7.",
          icon: <RefreshCcw size={18} />,
          name: "Refund / complain ( office...complain office )",
          access: "",
          path: "/view-refunds",
        },
        {
          id: 8,
          number: "8.",
          icon: <History size={18} />,
          name: "History orders same # 3",
          access: "",
          path: "/all-orders",
        },
      ],
    },
    {
      title: "STOCK",
      sections: [
        {
          id: 28,
          number: "31.",
          icon: <Archive size={18} />,
          name: "Product list everyone ( View can only check )",
          access: "",
          path: "/admin/Products",
        },
        {
          id: 33,
          number: "33.",
          icon: <Clipboard size={18} />,
          name: "Inventory check ( just controlling staff to double check and corret )",
          access: "",
          path: "/inventory-check",
        },
        {
          id: 35,
          number: "35.",
          icon: <AlertTriangle size={18} />,
          name: "Out of Stock...order stock",
          access: "",
          path: "/out-of-stock",
        },
        {
          id: 36,
          number: "36.",

          name: "Sales data for products",
          access: "",
          path: "/sales-data",
        },
      ],
    },
    {
      title: "STOCK 2",
      sections: [
        {
          id: 61,
          number: "51.",
          icon: <Package size={18} />,
          name: "Create a new product (articial emp)",
          access: "",
          path: "/add-product",
        },
        {
          id: 54,
          number: "54.",
          icon: <Package size={18} />,
          name: "Fill inventory (articial emp)",
          access: "",
          path: "/Fill-inventory",
        },
        {
          id: 55,
          number: "55.",
          icon: <Clipboard size={18} />,
          name: "Inventory control (articial emp)",
          access: "",
          path: "/inventory-control",
        },
        {
          id: 56,
          number: "56.",
          icon: <Tag size={18} />,
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
          number: "71.",
          icon: <Percent size={18} />,
          name: "Create discount (articial emp)",
          access: "",
          path: "/create-discount",
        },
        {
          id: 72,
          number: "72.",
          icon: <Percent size={18} />,
          name: "All Discount list, everyone )",
          access: "",
          path: "/all-discounts",
        },
        {
          id: 73,
          number: "73.",
          icon: <Percent size={18} />,
          name: "Discounted product inventory",
          access: "",
          path: "/discount-inventory",
        },
        {
          id: 74,
          number: "74.",
          icon: <FileText size={18} />,
          name: "Discount policies action (articial emp)",
          access: "",
          highlight: true,
        },
      ],
    },
    {
      title: " SUPLIER EMP, CUSTOMER",
      sections: [
        {
          id: 81,
          number: "81.",
          icon: <Users size={18} />,
          name: "Suppliers (articial emp)",
          path: "/view-suppliers",
          access: "",
        },
        {
          id: 82,
          number: "82.",
          icon: <Users size={18} />,
          name: "employees (articial emp)",
          path: "/all-employees",
          access: "",
        },
        {
          id: 83,
          number: "83.",
          icon: <Users size={18} />,
          name: "Customers ( articial emp )",
          access: "Timeline chat All orders",
        },
      ],
    },
    {
      title: " HISTORY",
      sections: [
        {
          id: 90,
          number: "90.",
          icon: <History size={18} />,
          name: "History orders supplier (Admin office)",
          access: "",
        },
      ],
    },
    {
      title: " FINANCE",
      sections: [
        {
          id: 101,
          number: "101.",
          icon: <CreditCard size={18} />,
          name: "Finances (articial emp)",
          access: "",
        },
      ],
    },
    {
      title: " LOWER ADMIN",
      sections: [
        {
          id: 100,
          number: "100.",
          icon: <Settings size={18} />,
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
          id: 103,
          number: "150.",
          icon: <Users size={18} />,
          name: "Referrals",
          access: "Video verification & sharing discount for each referral",
          path: "/referrals",
        },
      ],
    },
    {
      title: " FOREMAN",
      sections: [
        {
          id: 160,
          number: "160.",
          icon: <Users size={18} />,
          name: "from human earning structure",
          access: "",
        },
      ],
    },
    {
      title: "SETTINGS",
      sections: [
        {
          id: "settings",
          icon: <Settings size={18} />,
          name: "Settings",
          access: "",
        },
      ],
    },
    {
      title: "SUPPORT",
      sections: [
        {
          id: "support",
          icon: <HelpCircle size={18} />,
          name: "Support",
          access: "",
        },
      ],
    },
  ];

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200"
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-gray-200 transition-all duration-300 ease-in-out z-40 overflow-hidden shadow-2xl ${
          isOpen ? "w-80" : "w-0"
        }`}
      >
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-center sticky top-0 z-10 border-b border-gray-700">
            <div className="font-bold text-xl flex items-center gap-3 text-white">
              <Home size={24} className="text-blue-400" />
              <span>Dashboard</span>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-gray-300 hover:text-red-400 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>

          {/* Sections */}
          <div className="p-3">
            {sectionGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <div className="px-4 py-3 text-gray-700 text-sm font-medium uppercase tracking-wider bg-gradient-to-r from-gray-100 to-beige-100 border-l-2 border-blue-500 rounded-md mb-2">
                  {group.title}
                </div>
                {group.sections.length > 0 && (
                  <div className="space-y-1 ml-2">
                    {group.sections.map((section) => (
                      <div key={section.id}>
                        <button
                          onClick={() => {
                            if (section.isCollapsible) {
                              section.onClick();
                            } else if (section.path) {
                              handleSectionClick(section.id, section.path);
                            } else {
                              handleSectionClick(section.id);
                            }
                          }}
                          className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3 ${
                            section.highlight
                              ? "bg-gray-700 border-l-2 border-purple-500 hover:bg-gray-600"
                              : section.isCollapsible && adminOpen
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "hover:bg-gray-800"
                          } ${
                            section.path || section.isCollapsible
                              ? "cursor-pointer"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {section.number && (
                              <span className="text-green-400 font-medium">
                                {section.number}
                              </span>
                            )}
                            <span
                              className={
                                section.highlight
                                  ? "text-purple-400"
                                  : "text-blue-400"
                              }
                            >
                              {section.icon}
                            </span>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium leading-tight">
                                {formatMenuText(section.name)}
                              </span>
                              {section.isCollapsible ? (
                                adminOpen ? (
                                  <ChevronUp
                                    size={16}
                                    className="text-gray-400"
                                  />
                                ) : (
                                  <ChevronDown
                                    size={16}
                                    className="text-gray-400"
                                  />
                                )
                              ) : section.path ? (
                                <ChevronRight
                                  size={16}
                                  className="text-gray-400"
                                />
                              ) : null}
                            </div>
                            {section.access && (
                              <span className="text-xs text-gray-400 block truncate">
                                {section.access}
                              </span>
                            )}
                            {section.note && (
                              <span className="text-xs text-gray-400 block truncate">
                                {section.note}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Admin Sub Menu */}
                        {section.id === 100 && adminOpen && (
                          <div className="ml-8 mt-1 space-y-1 border-l border-gray-700 pl-2">
                            {adminSubItems.map((item) => (
                              <div key={item.id}>
                                <button
                                  onClick={() =>
                                    handleSectionClick(item.id, item.path)
                                  }
                                  className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 hover:bg-gray-800"
                                >
                                  <div className="flex items-center gap-2">
                                    {item.number && (
                                      <span className="text-green-400 font-medium text-xs">
                                        {item.number}
                                      </span>
                                    )}
                                    <span className="text-blue-400">
                                      {item.icon}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-300">
                                    {item.name}
                                  </span>
                                </button>

                                {/* Third level (a, b options) */}
                                {item.subItems && (
                                  <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-2">
                                    {item.subItems.map((subItem) => (
                                      <button
                                        key={subItem.id}
                                        onClick={() =>
                                          handleSectionClick(
                                            subItem.id,
                                            subItem.path
                                          )
                                        }
                                        className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 hover:bg-gray-800"
                                      >
                                        <span className="text-blue-400">
                                          {subItem.icon}
                                        </span>
                                        <span className="text-sm text-gray-300">
                                          {subItem.name}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Footer - Extra professional touch */}
            <div className="mt-8 mb-4 px-4 py-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>© 2025 Company Name</span>
                <span>v2.3.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6 text-gray-300">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { PortalSignOutModal } from "./PortalSignOutModal";
import { useAuth } from "../contexts/AuthContext";
import { markJoinAddRoleIntent } from "../utils/portalRouting";

type Page =
  | "home"
  | "pathways"
  | "about"
  | "community"
  | "coach-portal"
  | "player-portal"
  | "call-iso"
  | "store"
  | "for-coaches"
  | "join";
type UserRole = "coach" | "player" | "community-leader";

interface NavigationProps {
  onOpenCommunityPortal?: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onPlayerStatusChange?: (
    status: {
      isCommitted: boolean;
      coachName?: string;
      category?: string;
      daysRemaining?: number;
    } | null,
  ) => void;
}

export function Navigation({
  onOpenCommunityPortal,
  currentPage,
  onNavigate,
  onPlayerStatusChange,
}: NavigationProps) {
  const {
    isLoggedIn,
    isPlayerOnboarded,
    isCoachOnboarded,
    profile,
    signOut,
    switchPortalRole,
  } = useAuth();

  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [pendingPortalType, setPendingPortalType] = useState<
    "player" | "coach" | null
  >(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
    onNavigate("home");
  };

  const handleConfirmSignOut = () => {
    void handleLogout().then(() => onNavigate("join"));
    setShowSignOutModal(false);
    setPendingPortalType(null);
  };

  const handleCancelSignOut = () => {
    setShowSignOutModal(false);
    setPendingPortalType(null);
  };

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4">
        <div className="w-full max-w-5xl">
          <div
            className={`flex items-center justify-between rounded-full pl-5 pr-5 py-1 shadow-lg transition-all duration-300 ${
              isScrolled
                ? "bg-black/90 shadow-black/60 backdrop-blur-[40px]"
                : "bg-black/65 shadow-black/30 backdrop-blur-[16px]"
            }`}
            style={{ border: "1px solid rgba(255, 255, 255, 0.3)" }}
          >
            <div className="flex items-center pl-4">
              <button
                onClick={() => onNavigate("home")}
                className="transition-opacity cursor-pointer"
                onMouseEnter={() => setHoveredItem("logo")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span
                  className="text-white text-lg font-semibold tracking-wide transition-all"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    textShadow:
                      hoveredItem === "logo"
                        ? "0 0 12px rgba(255, 255, 255, 0.8)"
                        : "none",
                    color:
                      hoveredItem === "logo"
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  ISO Institute
                </span>
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => onNavigate("pathways")}
                onMouseEnter={() => setHoveredItem("pathways")}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  color:
                    hoveredItem === "pathways" || currentPage === "pathways"
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.7)",
                  textShadow:
                    hoveredItem === "pathways" || currentPage === "pathways"
                      ? "0 0 12px rgba(255, 255, 255, 0.8)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              >
                For Players
              </button>
              {/* Community tab - temporarily hidden */}
              {false && (
                <button
                  onClick={() => onNavigate("community")}
                  className={`transition-colors ${currentPage === "community" ? "text-white" : "text-white/70 hover:text-white"}`}
                >
                  Community
                </button>
              )}
              <button
                onClick={() => onNavigate("for-coaches")}
                onMouseEnter={() => setHoveredItem("for-coaches")}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  color:
                    hoveredItem === "for-coaches" ||
                    currentPage === "for-coaches"
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.7)",
                  textShadow:
                    hoveredItem === "for-coaches" ||
                    currentPage === "for-coaches"
                      ? "0 0 12px rgba(255, 255, 255, 0.8)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              >
                For Coaches
              </button>
              <button
                onClick={() => onNavigate("about")}
                onMouseEnter={() => setHoveredItem("about")}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  color:
                    hoveredItem === "about" || currentPage === "about"
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.7)",
                  textShadow:
                    hoveredItem === "about" || currentPage === "about"
                      ? "0 0 12px rgba(255, 255, 255, 0.8)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              >
                About
              </button>

              {/* Store - hidden on onboarding branch */}
              {false && (
                <button
                  onClick={() => onNavigate("store")}
                  onMouseEnter={() => setHoveredItem("store")}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    color:
                      hoveredItem === "store" || currentPage === "store"
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.7)",
                    textShadow:
                      hoveredItem === "store" || currentPage === "store"
                        ? "0 0 12px rgba(255, 255, 255, 0.8)"
                        : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  Store
                </button>
              )}

              {/* Portal Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                  onBlur={() =>
                    setTimeout(() => setShowPortalDropdown(false), 200)
                  }
                  onMouseEnter={() => setHoveredItem("portals")}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="flex items-center gap-1"
                  style={{
                    color:
                      hoveredItem === "portals" ||
                      showPortalDropdown ||
                      currentPage === "coach-portal" ||
                      currentPage === "player-portal"
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.7)",
                    textShadow:
                      hoveredItem === "portals" ||
                      showPortalDropdown ||
                      currentPage === "coach-portal" ||
                      currentPage === "player-portal"
                        ? "0 0 12px rgba(255, 255, 255, 0.8)"
                        : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  Portals
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showPortalDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showPortalDropdown && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                    style={{ background: "#0a0a0f" }}
                  >
                    <button
                      onClick={() => {
                        const activeRole = profile?.active_role;
                        if (!isLoggedIn) {
                          localStorage.setItem("iso_join_intent", "signin");
                          onNavigate("join");
                          setShowPortalDropdown(false);
                          return;
                        }
                        if (isCoachOnboarded || profile?.coach_application_status === "pending") {
                          onNavigate("coach-portal");
                        } else if (profile?.roles.includes("coach")) {
                          void switchPortalRole("coach").then(() => onNavigate("coach-portal"));
                        } else {
                          if (isPlayerOnboarded) markJoinAddRoleIntent();
                          onNavigate("join");
                        }
                        setShowPortalDropdown(false);
                      }}
                      onMouseEnter={() => setHoveredItem("coach-portal")}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="w-full text-left px-4 py-3 transition-all"
                      style={{
                        color:
                          hoveredItem === "coach-portal" ||
                          currentPage === "coach-portal"
                            ? "#ffffff"
                            : "rgba(203, 213, 225, 0.8)",
                        textShadow:
                          hoveredItem === "coach-portal" ||
                          currentPage === "coach-portal"
                            ? "0 0 12px rgba(255, 255, 255, 0.8)"
                            : "none",
                        backgroundColor:
                          hoveredItem === "coach-portal" ||
                          currentPage === "coach-portal"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "transparent",
                      }}
                    >
                      Coach Portal
                    </button>
                    <button
                      onClick={() => {
                        const activeRole = profile?.active_role;
                        if (!isLoggedIn) {
                          localStorage.setItem("iso_join_intent", "signin");
                          onNavigate("join");
                          setShowPortalDropdown(false);
                          return;
                        }
                        if (isPlayerOnboarded) {
                          if (activeRole !== "player") {
                            void switchPortalRole("player").then(() => onNavigate("player-portal"));
                          } else {
                            onNavigate("player-portal");
                          }
                        } else if (profile?.roles.includes("player")) {
                          onNavigate("join");
                        } else if (activeRole === "coach") {
                          setPendingPortalType("player");
                          setShowSignOutModal(true);
                        } else {
                          onNavigate("join");
                        }
                        setShowPortalDropdown(false);
                      }}
                      onMouseEnter={() => setHoveredItem("player-portal")}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="w-full text-left px-4 py-3 transition-all"
                      style={{
                        color:
                          hoveredItem === "player-portal" ||
                          currentPage === "player-portal"
                            ? "#ffffff"
                            : "rgba(203, 213, 225, 0.8)",
                        textShadow:
                          hoveredItem === "player-portal" ||
                          currentPage === "player-portal"
                            ? "0 0 12px rgba(255, 255, 255, 0.8)"
                            : "none",
                        backgroundColor:
                          hoveredItem === "player-portal" ||
                          currentPage === "player-portal"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "transparent",
                      }}
                    >
                      Player Portal
                    </button>
                    {/* Community Portal - temporarily hidden */}
                    {false && (
                      <button
                        onClick={() => {
                          onNavigate("join");
                          setShowPortalDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Community Portal
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Auth area — state-aware buttons */}
              {(() => {
                const isOnboarded = isPlayerOnboarded || isCoachOnboarded;
                if (isOnboarded) {
                  // Fully onboarded — just sign out
                  return (
                    <button
                      onClick={() => void handleLogout()}
                      onMouseEnter={() => setHoveredItem("signout")}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="relative rounded-full font-semibold transition-all duration-200"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "14px",
                        letterSpacing: "2px",
                        padding: "7px 22px",
                        margin: "3px 6px 3px 8px",
                        background:
                          hoveredItem === "signout"
                            ? "rgba(255,255,255,0.15)"
                            : "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.85)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Sign Out
                    </button>
                  );
                } else if (isLoggedIn) {
                  // Logged in but not onboarded — Onboard + Sign Out
                  return (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                        margin: "3px 6px 3px 8px",
                      }}
                    >
                      <button
                        onClick={() => {
                          localStorage.removeItem("iso_join_intent");
                          onNavigate("join");
                        }}
                        onMouseEnter={() => setHoveredItem("onboard")}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="relative rounded-full font-semibold transition-all duration-200"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "14px",
                          letterSpacing: "2px",
                          padding: "7px 22px",
                          background:
                            hoveredItem === "onboard"
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.88)",
                          color: "#0A0A0A",
                          border: "1px solid rgba(255,255,255,0.6)",
                          boxShadow:
                            hoveredItem === "onboard"
                              ? "0 0 20px rgba(255,255,255,0.2)"
                              : "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Onboard
                      </button>
                      <button
                        onClick={() => void handleLogout()}
                        onMouseEnter={() => setHoveredItem("signout")}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="relative rounded-full font-semibold transition-all duration-200"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "14px",
                          letterSpacing: "2px",
                          padding: "7px 22px",
                          background:
                            hoveredItem === "signout"
                              ? "rgba(255,255,255,0.15)"
                              : "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.85)",
                          border: "1px solid rgba(255,255,255,0.25)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  );
                } else {
                  // Not logged in — Join ISO + Sign In
                  return (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                        margin: "3px 6px 3px 8px",
                      }}
                    >
                      <button
                        onClick={() => {
                          localStorage.setItem("iso_join_intent", "signin");
                          onNavigate("join");
                        }}
                        onMouseEnter={() => setHoveredItem("signin")}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="relative rounded-full font-semibold transition-all duration-200"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "14px",
                          letterSpacing: "2px",
                          padding: "7px 22px",
                          background: "transparent",
                          color:
                            hoveredItem === "signin"
                              ? "#ffffff"
                              : "rgba(255,255,255,0.7)",
                          border: "1px solid rgba(255,255,255,0.25)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          if (isLoggedIn && (isPlayerOnboarded || isCoachOnboarded)) {
                            markJoinAddRoleIntent();
                          }
                          localStorage.removeItem("iso_join_intent");
                          onNavigate("join");
                        }}
                        onMouseEnter={() => setHoveredItem("join")}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="relative rounded-full font-semibold transition-all duration-200"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "14px",
                          letterSpacing: "2px",
                          padding: "7px 22px",
                          background:
                            hoveredItem === "join" || currentPage === "join"
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.88)",
                          color: "#0A0A0A",
                          border: "1px solid rgba(255,255,255,0.6)",
                          boxShadow:
                            hoveredItem === "join" || currentPage === "join"
                              ? "0 0 20px rgba(255,255,255,0.2)"
                              : "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Join ISO
                      </button>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </nav>

      {showSignOutModal && pendingPortalType && (
        <PortalSignOutModal
          pendingPortalType={pendingPortalType}
          onCancel={handleCancelSignOut}
          onConfirm={handleConfirmSignOut}
        />
      )}
    </>
  );
}

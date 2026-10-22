import { Plus, MessageSquare, Trash2, Clock } from "lucide-react";
import { ChatSession } from "@/lib/chatHistory";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

type Props = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ChatSidebar = ({ sessions, activeSessionId, onSelectSession, onNewChat, onDeleteSession }: Props) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-3">
        <Button onClick={onNewChat} className="w-full gap-2 font-heading text-sm" size={collapsed ? "icon" : "default"}>
          <Plus className="h-4 w-4" />
          {!collapsed && "New Chat"}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="font-heading text-xs">Chat History</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {sessions.length === 0 && !collapsed && (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No conversations yet
                </div>
              )}
              {sessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectSession(session)}
                    isActive={session.id === activeSessionId}
                    className="group relative"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <span className="block truncate text-xs font-medium">{session.title}</span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />
                          {timeAgo(session.updatedAt)}
                          {session.subject && ` · ${session.subject}`}
                        </span>
                      </div>
                    )}
                    {!collapsed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="absolute right-1 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive p-1 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;

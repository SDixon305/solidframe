'use client'

// Wrapper for backward compatibility - delegates to shared Sidebar
// Can be removed once all imports are updated to use shared/Sidebar directly

import { Sidebar } from './shared'
import { useToolbox } from '@/hooks/use-toolbox'

interface ToolboxSidebarProps {
    userEmail?: string;
    activeFolder?: string;
    onFolderSelect?: (folderId: string) => void;
}

export default function ToolboxSidebar({ userEmail, activeFolder, onFolderSelect }: ToolboxSidebarProps) {
    const { folders, loading } = useToolbox()

    return (
        <Sidebar
            folders={folders}
            activeFolder={activeFolder}
            onFolderSelect={onFolderSelect}
            userEmail={userEmail}
            loading={loading}
        />
    )
}

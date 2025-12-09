'use client'

import { useState } from 'react'

import { DashboardLayout, Header, Sidebar, ToolGrid } from './shared'
import { useToolbox } from '@/hooks/use-toolbox'

export default function ToolboxDashboard({ userEmail }: { userEmail: string | undefined }) {
    const [activeFolder, setActiveFolder] = useState('sales_demos')
    const { folders, loading } = useToolbox()

    const currentFolder = folders[activeFolder]

    return (
        <DashboardLayout
            loading={loading}
            loadingMessage="Loading toolbox..."
            sidebar={
                <Sidebar
                    folders={folders}
                    activeFolder={activeFolder}
                    onFolderSelect={setActiveFolder}
                    userEmail={userEmail}
                    loading={loading}
                />
            }
            header={
                <Header
                    folder={currentFolder}
                    folderId={activeFolder}
                />
            }
        >
            {currentFolder && (
                <ToolGrid
                    tools={currentFolder.tools}
                    folderId={activeFolder}
                />
            )}
        </DashboardLayout>
    )
}

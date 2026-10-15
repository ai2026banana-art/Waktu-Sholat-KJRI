/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DigitalSignageMockup } from './components/DigitalSignageMockup';
import { AndroidExportModal } from './components/AndroidExportModal';

export default function App() {
  const [isCodeExportOpen, setIsCodeExportOpen] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#021812] select-none">
      {/* Papan Jadwal Sholat Digital TV (Mockup Sesuai Spesifikasi 16:9 Landscape) */}
      <DigitalSignageMockup
        onOpenAndroidCode={() => setIsCodeExportOpen(true)}
      />

      {/* Modal Kode Sumber Android Native (Kotlin + Compose) & Download ZIP */}
      <AndroidExportModal
        isOpen={isCodeExportOpen}
        onClose={() => setIsCodeExportOpen(false)}
      />
    </div>
  );
}

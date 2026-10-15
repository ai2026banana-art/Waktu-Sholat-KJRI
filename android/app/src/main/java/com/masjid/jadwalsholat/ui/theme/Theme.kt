package com.masjid.jadwalsholat.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Palet Warna Lembut, Bersih, dan Modern: Sage Pucat, Krem Hangat, Putih Tulang, Biru Langit Lembut, & Emas Pucat
val WarmCreamBg = Color(0xFFF7F5EF)
val BoneWhiteCard = Color(0xF5FFFFFF)
val PaleSage = Color(0xFF8BA89B)
val PaleSageCard = Color(0xFFEAF2EE)
val SoftSkyBlue = Color(0xFFE0F2FE)
val PaleGold = Color(0xFFD4AF37)
val PaleGoldCard = Color(0xFFFEF8EA)
val PaleGoldBorder = Color(0xFFE5CF96)
val TextDeepForest = Color(0xFF143023)
val TextMutedSage = Color(0xFF557B6A)

private val SoftSageColorScheme = lightColorScheme(
    primary = PaleGold,
    secondary = PaleSage,
    background = WarmCreamBg,
    surface = BoneWhiteCard,
    onPrimary = Color.White,
    onBackground = TextDeepForest,
    onSurface = TextDeepForest
)

@Composable
fun JadwalSholatTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = SoftSageColorScheme,
        content = content
    )
}

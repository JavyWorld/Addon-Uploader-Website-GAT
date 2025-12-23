local addonName = ...
local GAT = _G[addonName]

function GAT:CreateManageUI(parent)
    if GAT.ManagePanel then return end

    local f = CreateFrame("Frame", nil, parent)
    f:SetPoint("TOPLEFT", 10, -50)
    f:SetSize(400, 400)
    f:Hide()
    GAT.ManagePanel = f

    local title = f:CreateFontString(nil, "OVERLAY", "GameFontHighlightLarge")
    title:SetPoint("TOPLEFT", 0, 0)
    title:SetText("Detalles del Jugador")

    -- Nombre
    f.PlayerName = f:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
    f.PlayerName:SetPoint("TOPLEFT", 0, -40)
    f.PlayerName:SetText("Jugador:")

    f.LastSeen = f:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    f.LastSeen:SetPoint("TOPLEFT", 0, -70)

    f.LastMessage = f:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    f.LastMessage:SetPoint("TOPLEFT", 0, -100)
    f.LastMessage:SetWidth(380)
    f.LastMessage:SetJustifyH("LEFT")

    f.Daily = f:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
    f.Daily:SetPoint("TOPLEFT", 0, -150)
    f.Daily:SetWidth(380)
end

function GAT:LoadPlayer(name)
    if not GAT.ManagePanel then return end
    local f = GAT.ManagePanel

    local data = GAT:GetPlayerData(name)
    if not data then return end

    f.PlayerName:SetText("Jugador: |cffffff00" .. name .. "|r")
    f.LastSeen:SetText("|cff00ffffÚltimo mensaje:|r " .. (data.lastSeen or "N/A"))
    f.LastMessage:SetText("|cff00ffffMensaje:|r |cffffffff" .. (data.lastMessage or "N/A") .. "|r")

    local dailyText = "|c00ff00Actividad por día:|r\n"
    local sortedDays = {}
    for d, _ in pairs(data.daily or {}) do
        table.insert(sortedDays, d)
    end
    table.sort(sortedDays, function(a,b) return a > b end)
    
    for _, d in ipairs(sortedDays) do
        dailyText = dailyText .. " |cffffff00" .. d .. "|r → " .. data.daily[d] .. " mensajes\n"
    end

    f.Daily:SetText(dailyText)
end

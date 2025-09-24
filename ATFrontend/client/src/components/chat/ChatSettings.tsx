import { useState } from "react";
import { Settings, Volume2, VolumeX, Type, Languages, Palette } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import { Slider } from "src/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Switch } from "src/components/ui/switch";
import { Label } from "src/components/ui/label";

interface ChatSettingsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
}

export default function ChatSettings({
  fontSize,
  onFontSizeChange,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  soundEnabled,
  onSoundToggle
}: ChatSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chat Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Font Size Control */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size
            </Label>
            <div className="px-3">
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => onFontSizeChange(value)}
                max={20}
                min={12}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Small</span>
                <span>{fontSize}px</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Translation Language
            </Label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                />
                <Label>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Label>
              </div>
            </div>
          </div>

          {/* Sound Settings */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Notification Sounds
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={soundEnabled}
                onCheckedChange={onSoundToggle}
              />
              <Label>{soundEnabled ? 'Enabled' : 'Disabled'}</Label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
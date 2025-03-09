import { Switch } from '@/components/ui/switch';
import { ContentType } from '@/types';
import { Label } from '@/components/ui/label';

interface ContentToggleProps {
  contentType: ContentType;
  onChange: (type: ContentType) => void;
}

export function ContentToggle({ contentType, onChange }: ContentToggleProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Label 
          htmlFor="content-toggle" 
          className={contentType === 'movie' ? 'font-bold' : ''}
        >
          Movies
        </Label>
        <Switch
          id="content-toggle"
          checked={contentType === 'tv'}
          onCheckedChange={(checked) => onChange(checked ? 'tv' : 'movie')}
        />
        <Label 
          htmlFor="content-toggle" 
          className={contentType === 'tv' ? 'font-bold' : ''}
        >
          TV Shows
        </Label>
      </div>
    </div>
  );
}
import { useId, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { WEEKDAY_OPTIONS, type Field, type ListField } from '../content/schema';
import { newId, safeHttpsUrl, type Errors } from '../content/validate';

type Obj = Record<string, unknown>;

interface FieldsProps {
  fields: Field[];
  value: Obj;
  path: string;
  errors: Errors;
  onChange: (next: Obj) => void;
}

const blank = (fields: Field[]): Obj => {
  const item: Obj = {};
  for (const field of fields) {
    item[field.key] =
      field.kind === 'group' ? blank(field.fields)
      : field.kind === 'list' || field.kind === 'days' ? []
      : field.kind === 'select' ? field.options[0].value
      : '';
  }
  return item;
};

/** Renders a form from field descriptors. The same descriptors validate the save. */
export function Fields({ fields, value, path, errors, onChange }: FieldsProps) {
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const at = path ? `${path}.${field.key}` : field.key;
        const set = (next: unknown) => onChange({ ...value, [field.key]: next });
        if (field.kind === 'group') {
          return (
            <fieldset key={field.key} className="border-t border-line pt-6">
              <legend className="float-left mb-4 w-full text-lg font-bold">{field.label}</legend>
              <div className="clear-both">
                <Fields fields={field.fields} value={(value[field.key] as Obj) ?? {}} path={at} errors={errors} onChange={set} />
              </div>
            </fieldset>
          );
        }
        if (field.kind === 'list') {
          return <ListEditor key={field.key} field={field} items={(value[field.key] as Obj[]) ?? []} path={at} errors={errors} onChange={set} />;
        }
        return <Scalar key={field.key} field={field} value={value[field.key]} error={errors[at]} onChange={set} />;
      })}
    </div>
  );
}

function Scalar({ field, value, error, onChange }: {
  field: Exclude<Field, { kind: 'group' | 'list' }>; value: unknown; error?: string; onChange: (next: unknown) => void;
}) {
  const id = useId();
  const describedBy = [error && `${id}-error`, field.help && `${id}-help`].filter(Boolean).join(' ') || undefined;
  const common = { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, className: 'field' } as const;
  const text = typeof value === 'string' ? value : '';
  const messages = (
    <>
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
      {field.help && <p id={`${id}-help`} className="field-help">{field.help}</p>}
    </>
  );

  if (field.kind === 'days') {
    const days = Array.isArray(value) ? (value as string[]) : [];
    return (
      <fieldset aria-describedby={describedBy}>
        <legend className="field-label">{field.label}</legend>
        <div className="flex flex-wrap gap-x-4">
          {WEEKDAY_OPTIONS.map((day) => (
            <label key={day} className="flex min-h-11 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="size-5 accent-amber-700"
                checked={days.includes(day)}
                onChange={(event) => onChange(event.target.checked ? [...days, day] : days.filter((d) => d !== day))}
              />
              {day.slice(0, 3)}
            </label>
          ))}
        </div>
        {messages}
      </fieldset>
    );
  }

  let control;
  if (field.kind === 'select') {
    control = (
      <select {...common} value={text} onChange={(event) => onChange(event.target.value)}>
        {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    );
  } else if (field.kind === 'text' && field.multiline) {
    control = <textarea {...common} rows={3} maxLength={field.max + 50} value={text} onChange={(event) => onChange(event.target.value)} />;
  } else {
    const type = field.kind === 'time' ? 'time' : field.kind === 'email' ? 'email' : field.kind === 'phone' ? 'tel' : field.kind === 'url' ? 'url' : 'text';
    control = (
      <input
        {...common}
        type={type}
        inputMode={field.kind === 'url' ? 'url' : undefined}
        placeholder={field.kind === 'url' ? 'https://' : undefined}
        maxLength={field.kind === 'text' ? field.max + 50 : 500}
        value={text}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  const preview = field.kind === 'url' && field.image ? safeHttpsUrl(text) : null;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="field-label">
          {field.label}
          {field.kind === 'url' && !field.required && <span className="font-normal text-muted"> (optional)</span>}
        </label>
        {field.kind === 'text' && text.length > field.max * 0.8 && (
          <span className={`text-sm tabular-nums ${text.length > field.max ? 'font-medium text-danger' : 'text-muted'}`}>
            {text.length} / {field.max}
          </span>
        )}
      </div>
      <div className={preview ? 'flex items-start gap-3' : undefined}>
        {preview && <img src={preview} alt="" referrerPolicy="no-referrer" className="size-12 shrink-0 rounded-lg border border-line object-cover" />}
        {control}
      </div>
      {messages}
    </div>
  );
}

function ListEditor({ field, items, path, errors, onChange }: {
  field: ListField; items: Obj[]; path: string; errors: Errors; onChange: (next: Obj[]) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const move = (index: number, by: number) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    onChange(next);
  };
  const add = () => {
    const item = { id: newId(), ...blank(field.fields) };
    onChange([...items, item]);
    setOpenId(item.id);
  };
  const hasError = (index: number) => Object.keys(errors).some((key) => key.startsWith(`${path}.${index}.`));
  const secondary = field.fields.find((f) => f.key === 'price' || f.key === 'day' || f.key === 'opens')?.key;

  return (
    <section className="border-t border-line pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold">
          {field.label} <span className="font-normal text-muted tabular-nums">({items.length})</span>
        </h3>
        <button type="button" onClick={add} disabled={items.length >= field.max} className="btn btn-secondary btn-sm">
          <Plus size={18} aria-hidden="true" /> Add {field.itemName}
        </button>
      </div>
      {errors[path] && <p className="field-error">{errors[path]}</p>}
      {items.length === 0 && <p className="mt-4 text-muted">Nothing here yet. Add a {field.itemName} to show it on the site.</p>}

      <ul className="mt-4 divide-y divide-line border-y border-line empty:hidden">
        {items.map((item, index) => {
          const id = String(item.id);
          const title = String(item[field.titleKey] || `New ${field.itemName}`);
          const open = openId === id;
          return (
            <li key={id} className="py-2">
              <div className="flex items-center gap-1">
                <p className="min-w-0 flex-1 truncate py-2 font-medium">
                  {title}
                  {secondary && item[secondary] ? <span className="ml-2 font-normal text-muted">{String(item[secondary])}</span> : null}
                  {hasError(index) && <span className="ml-2 text-sm font-medium text-danger">Needs attention</span>}
                </p>
                <button type="button" className="icon-btn" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${title} up`}>
                  <ArrowUp size={18} aria-hidden="true" />
                </button>
                <button type="button" className="icon-btn" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Move ${title} down`}>
                  <ArrowDown size={18} aria-hidden="true" />
                </button>
                <button type="button" className="icon-btn" onClick={() => setOpenId(open ? null : id)} aria-expanded={open} aria-label={`${open ? 'Close' : 'Edit'} ${title}`}>
                  <Pencil size={18} aria-hidden="true" />
                </button>
                <button type="button" className="icon-btn text-danger" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={`Remove ${title}`}>
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
              {(open || hasError(index)) && (
                <div className="pt-2 pb-4">
                  <Fields
                    fields={field.fields}
                    value={item}
                    path={`${path}.${index}`}
                    errors={errors}
                    onChange={(next) => onChange(items.map((current, i) => (i === index ? next : current)))}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

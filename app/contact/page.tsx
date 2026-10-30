'use client';

import { useState } from 'react';
import { Bug, Lightbulb, Mail, MessageSquare } from 'lucide-react';
import { Button, Input, PageHeader, Select, Textarea } from '@/components/ui';

const CONTACT_EMAIL = 'nkcoderz@gmail.com';

const subjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'bug', label: 'Report a Bug' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'other', label: 'Other' },
];

const reasons = [
  { icon: MessageSquare, title: 'Feedback', description: 'Tell us what helped and what was confusing.' },
  { icon: Lightbulb, title: 'Topic requests', description: 'Suggest a visualizer or pattern you want to see next.' },
  { icon: Bug, title: 'Bug reports', description: 'Something broken? Include the page and what you expected.' },
];

const emptyForm = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm);

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // There's no backend: the form opens the visitor's mail client with everything pre-filled.
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || 'Contact Form Submission');
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      <PageHeader
        align="left"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        title="Contact Us"
        description="We'd love to hear from you."
      />

      <div className="page-container grid gap-8 py-12 md:py-16 lg:grid-cols-5">
        <form onSubmit={send} className="space-y-5 rounded-card border border-line bg-white p-6 shadow-card sm:p-8 lg:col-span-3">
          <h2 className="text-xl font-semibold text-ink">Send us a message</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Name" name="name" required fullWidth value={form.name} onChange={update} />
            <Input label="Email" name="email" type="email" required fullWidth value={form.email} onChange={update} />
          </div>
          <Select label="Subject" name="subject" required value={form.subject} onChange={update}>
            <option value="">Select a subject</option>
            {subjects.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
          <Textarea label="Message" name="message" required rows={6} value={form.message} onChange={update} />
          <Button type="submit" size="lg" fullWidth>Send message</Button>
        </form>

        <aside className="space-y-4 lg:col-span-2">
          <div className="rounded-card border border-line bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-ink">Email</h2>
                <p className="text-sm text-ink-muted">{CONTACT_EMAIL}</p>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-line bg-subtle p-6">
            <h2 className="font-semibold text-ink">What can we help with?</h2>
            <ul className="mt-4 space-y-4">
              {reasons.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-ink">{title}</p>
                    <p className="text-sm text-ink-muted">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
